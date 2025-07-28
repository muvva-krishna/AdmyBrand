// API service for fetching real-time data from various public APIs
export interface ApiMetrics {
  totalRevenue: number;
  activeUsers: number;
  totalConversions: number;
  growthRate: number;
}

export interface ApiChartData {
  date: string;
  revenue: number;
  users: number;
  conversions: number;
  impressions: number;
  clicks: number;
}

export interface ApiCampaignData {
  id: string;
  campaign: string;
  channel: string;
  revenue: number;
  conversions: number;
  ctr: number;
  status: 'active' | 'paused' | 'completed';
  date: string;
}

export interface ApiChannelData {
  name: string;
  value: number;
  color: string;
}

// Fetch cryptocurrency data to simulate revenue metrics
export async function fetchRevenueMetrics(): Promise<ApiMetrics> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/global');
    const data = await response.json();
    
    const marketCap = data.data.total_market_cap.usd;
    const volume = data.data.total_volume.usd;
    const dominance = data.data.market_cap_percentage.btc;
    
    return {
      totalRevenue: Math.round(marketCap / 1000000000), // Convert to millions
      activeUsers: Math.round(volume / 1000000), // Convert to millions
      totalConversions: Math.round(dominance * 1000),
      growthRate: Math.round((dominance - 40) * 10) / 10 // Simulate growth rate
    };
  } catch (error) {
    console.error('Error fetching revenue metrics:', error);
    // Fallback to mock data
    return {
      totalRevenue: 847392,
      activeUsers: 24847,
      totalConversions: 18394,
      growthRate: 15.2
    };
  }
}

// Fetch trending cryptocurrencies to simulate campaign performance
export async function fetchCampaignData(): Promise<ApiCampaignData[]> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1');
    const coins = await response.json();
    
    const channels = ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube', 'Email', 'Organic'];
    const statuses: ('active' | 'paused' | 'completed')[] = ['active', 'paused', 'completed'];
    
    return coins.map((coin: any, index: number) => ({
      id: coin.id,
      campaign: `${coin.name} Campaign`,
      channel: channels[index % channels.length],
      revenue: Math.round(coin.current_price * 1000),
      conversions: Math.round(coin.market_cap_rank * 50),
      ctr: parseFloat((coin.price_change_percentage_24h || 0).toFixed(2)),
      status: statuses[index % statuses.length],
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      })
    }));
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    return [];
  }
}

// Fetch posts data to simulate user engagement over time
export async function fetchChartData(): Promise<ApiChartData[]> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    
    // Group posts by user and create time series data
    const userGroups: { [key: number]: any[] } = {};
    posts.forEach((post: any) => {
      if (!userGroups[post.userId]) {
        userGroups[post.userId] = [];
      }
      userGroups[post.userId].push(post);
    });
    
    const chartData: ApiChartData[] = [];
    const today = new Date();
    
    // Create data for last 10 days using post data
    Object.keys(userGroups).slice(0, 10).forEach((userId, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (9 - index));
      
      const userPosts = userGroups[parseInt(userId)];
      const baseRevenue = userPosts.length * 5000;
      const baseUsers = userPosts.length * 100;
      
      chartData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        revenue: baseRevenue + Math.random() * 10000,
        users: baseUsers + Math.random() * 200,
        conversions: Math.round(baseUsers * 0.15),
        impressions: Math.round(baseUsers * 8),
        clicks: Math.round(baseUsers * 0.8)
      });
    });
    
    return chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return [];
  }
}

// Fetch user data to simulate channel distribution
export async function fetchChannelData(): Promise<ApiChannelData[]> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();
    
    // Simulate channel distribution based on user data
    const channels = [
      { name: 'Google Ads', color: '#3B82F6' },
      { name: 'Facebook', color: '#10B981' },
      { name: 'Instagram', color: '#F59E0B' },
      { name: 'LinkedIn', color: '#8B5CF6' },
      { name: 'Other', color: '#6B7280' }
    ];
    
    return channels.map((channel, index) => ({
      ...channel,
      value: Math.round((users.length - index * 2) * 3.5) // Distribute based on user count
    }));
  } catch (error) {
    console.error('Error fetching channel data:', error);
    return [
      { name: 'Google Ads', value: 35, color: '#3B82F6' },
      { name: 'Facebook', value: 25, color: '#10B981' },
      { name: 'Instagram', value: 20, color: '#F59E0B' },
      { name: 'LinkedIn', value: 12, color: '#8B5CF6' },
      { name: 'Other', value: 8, color: '#6B7280' }
    ];
  }
}

// Fetch weather data for geographic analytics simulation
export async function fetchGeographicData() {
  try {
    const cities = ['London', 'New York', 'Tokyo', 'Sydney', 'Berlin'];
    const promises = cities.map(city => 
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=demo&units=metric`)
        .catch(() => null)
    );
    
    const responses = await Promise.all(promises);
    const validResponses = responses.filter(response => response?.ok);
    
    if (validResponses.length > 0) {
      const weatherData = await Promise.all(
        validResponses.map(response => response!.json())
      );
      
      return weatherData.map((data, index) => ({
        city: data.name,
        temperature: Math.round(data.main.temp),
        // Simulate campaign performance based on weather
        performance: Math.round(50 + (data.main.temp * 2))
      }));
    }
  } catch (error) {
    console.error('Error fetching geographic data:', error);
  }
  
  return [];
}