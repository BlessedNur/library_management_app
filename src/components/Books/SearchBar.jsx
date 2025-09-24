import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Select, SelectItem } from "../ui/Select";
import { Card, CardContent } from "../ui/Card";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    genre: "all",
    availability: "all",
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value, filters);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onSearch(searchTerm, newFilters);
  };

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Mystery",
    "Romance",
    "Thriller",
    "Biography",
    "History",
    "Science",
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium mb-2">
              Search Books
            </label>
            <Input
              id="search"
              type="text"
              placeholder="Search by title, author, ISBN, or genre..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Genre Filter */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium mb-2">
              Genre
            </label>
            <Select
              id="genre"
              value={filters.genre}
              onChange={(e) => handleFilterChange("genre", e.target.value)}
            >
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Availability Filter */}
          <div>
            <label
              htmlFor="availability"
              className="block text-sm font-medium mb-2"
            >
              Availability
            </label>
            <Select
              id="availability"
              value={filters.availability}
              onChange={(e) =>
                handleFilterChange("availability", e.target.value)
              }
            >
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="borrowed">Borrowed</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchBar;
