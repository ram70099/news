import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/Readmore.css'; // Import the CSS file for ReadMore component
import Header from './Header';
import Footer from './Footer';
 // Import Header component

const ReadMore = () => {
  const { id } = useParams(); // Get the article ID from the URL
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = 'f427b400450f42f6aacfd99beeda0b7b'; // Your API key

  useEffect(() => {
    const getArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the article details using its unique ID
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${id}&apiKey=${apiKey}`);
        const articleData = response.data.articles[0]; // Assuming the first result is the one we want
        setArticle(articleData);
      } catch (err) {
        setError('Failed to fetch article. Please try again later.');
      }

      setLoading(false);
    };

    getArticle();
  }, [id]);

  if (loading) {
    return <div>Loading article...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!article) {
    return <div>Article not found.</div>;
  }

  return (
    <div>
      <Header /> {/* Add Header here */}
      
      <div className="read-more-container">
        <h1>{article.title}</h1>
        {article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
        
        <div className="article-info">
          <p><strong>Source: </strong>{article.source.name}</p>
          <p><strong>Published on: </strong>{new Date(article.publishedAt).toLocaleDateString()}</p>
        </div>

        <div className="article-description">
          <h3>Description:</h3>
          <p>{article.description}</p>
        </div>
        
        <div className="article-content">
          <h3>Content:</h3>
          <p>{article.content}</p>
        </div>
        
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          <button>Read Full Article</button>
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default ReadMore;
