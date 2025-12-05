export interface Author {
  authorId: number
  name: string
  genres: string[]
  totalBooks: number
  coverImage?: string
  avgRating?: number
  description?: string
}

export interface AuthorSummary {
  authorId: number
  name: string
  coverImage: string
  avgRating?: number
}

export interface AuthValues {
  user_id?: number
  user_name?: string
}

export interface Book {
  bookId: number
  isbn: string
  title: string
  author: string
  coverImage: string
  description: string
  genre: string
  publisher: string
  publicationDate: string
  isSaved?: number
  avgRating?: number
}

export interface BookSummary {
  bookId: number
  isbn: string
  title: string
  author: string
  coverImage: string
  genre: string
}

export interface PopularBook extends BookSummary {
  avgRating: number
  totalReviews: number
  popularityRank: number
}

export interface Review {
  reviewId: number
  userId?: number
  userName?: string
  rating: number
  content: string
  reviewDate: string
}

export interface GenreRow {
  genre: string
  genreId: number
  genreBooks: BookSummary[]
}

export interface ApiResponse {
  status: string
  data: {}
}
