import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Card = ({ data }) => {
  return (
    <div className="cardContainer">
      {data.map((curItem, index) => {
        if (!curItem.urlToImage) {
          return null; // Skip items without an image
        } else {
          return (
            <div className="card" key={index}>
              <img src={curItem.urlToImage} alt={curItem.title} />
              <div className="content">
                {/* Use the article's title and id to link to the ReadMore page */}
                <Link to={`/read-more/${curItem.title}`} className="title">
                  {curItem.title}
                </Link>
                <p>{curItem.description}</p>
                <Link to={`/read-more/${curItem.title}`}>
                  <button>Read More</button>
                </Link>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Card;
