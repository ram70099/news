import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import Footer from './Footer';
import Header from './Header'; // Import the Header component

const categories = [
  'sports',
  'politics',
  'entertainment',
  'health',
  'fitness',
];

const Newsapp = () => {
  const [newsData, setNewsData] = useState([]);
  const [category, setCategory] = useState('india'); // Default category
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const apiKey = 'f427b400450f42f6aacfd99beeda0b7b'; // Replace with your API key

  // Fetch news data based on category or search query
  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      setError(null);
      const query = search || category; // Use search term if available, otherwise use category
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`
        );
        setNewsData(response.data.articles.slice(0, 9)); // Take the first 10 articles
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
        console.error('Error fetching news:', err);
      }
      setLoading(false);
    };

    getNews();
  }, [category, search]); // Refetch when either category or search changes

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearch(''); // Reset search if category is changed
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = async () => {
    setCategory(''); // Clear category if search is submitted
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${search}&apiKey=${apiKey}`
      );
      setNewsData(response.data.articles.slice(0, 10)); // Take the first 10 articles
    } catch (err) {
      setError('Failed to fetch news. Please try again later.');
      console.error('Error fetching news:', err);
    }
    setLoading(false);
  };

  return (
    <div>
      <Header 
        search={search}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
      />

      <div>
        <p className="head">Stay Updated with TrendyNews</p>
      </div>
      <div className="categoryBtn">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            value={cat}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div className="loading-spinner">Loading...</div>}
      {error && <p className="error-message">{error}</p>}

      <div>
        {newsData.length > 0 ? (
          <Card data={newsData} />
        ) : (
          <p>No articles found</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Newsapp;
