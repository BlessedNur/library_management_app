import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Card, CardContent, CardFooter } from "../ui/Card";

const BookCard = ({ book }) => {
  const getAvailabilityColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "borrowed":
        return "bg-red-100 text-red-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Book Cover */}
      <div className="aspect-w-3 aspect-h-4 bg-gray-200">
        <img
          src={book.coverImage || "/api/placeholder/300/400"}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Book Info */}
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {book.title}
        </h3>

        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">{book.genre}</span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(
              book.availability
            )}`}
          >
            {book.availability}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-gray-900">
            ISBN: {book.isbn}
          </span>
          <Button asChild size="sm" variant="outline">
            <Link to={`/books/${book.id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
