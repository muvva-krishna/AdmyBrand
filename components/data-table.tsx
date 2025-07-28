'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ChevronUp, ChevronDown, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { TableData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: TableData[];
}

type SortField = keyof TableData;
type SortDirection = 'asc' | 'desc';

export function DataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('revenue'); // Default sort by market cap
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      const matchesSearch = item.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.channel.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [data, searchTerm, statusFilter, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'destructive';
      default: return 'secondary';
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Symbol', 'Market Cap (USD)', 'Volume (24h)', 'Change (24h) %', 'Status', 'Date'],
      ...filteredAndSortedData.map(item => [
        item.campaign,
        item.channel,
        item.revenue.toString(),
        item.conversions.toString(),
        item.ctr.toString(),
        item.status,
        item.date
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crypto-market-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
    >
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Cryptocurrency Market</CardTitle>
              <CardDescription>Live data for top cryptocurrencies</CardDescription>
            </div>
            <Button onClick={exportData} variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Positive</SelectItem>
                <SelectItem value="paused">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('campaign')} className="h-auto p-0 font-medium hover:bg-transparent">
                      Name
                      {sortField === 'campaign' && (sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />)}
                    </Button>
                  </TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('revenue')} className="h-auto p-0 font-medium hover:bg-transparent">
                      Market Cap
                      {sortField === 'revenue' && (sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />)}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('conversions')} className="h-auto p-0 font-medium hover:bg-transparent">
                      Volume (24h)
                      {sortField === 'conversions' && (sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />)}
                    </Button>
                  </TableHead>
                  <TableHead>Change (24h)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id} className="transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium">{item.campaign}</TableCell>
                    <TableCell>{item.channel}</TableCell>
                    <TableCell>${item.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</TableCell>
                    <TableCell>${item.conversions.toLocaleString('en-US', { maximumFractionDigits: 0 })}</TableCell>
                    <TableCell className={cn(item.ctr > 0 ? 'text-green-600' : 'text-red-600')}>
                      {item.ctr.toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.status)} className="capitalize">
                        {item.status === 'active' ? 'Positive' : 'Negative'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                  Previous
                </Button>
                {/* Simple pagination for brevity, can be expanded */}
                <span className="text-sm font-medium">{`Page ${currentPage} of ${totalPages}`}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
