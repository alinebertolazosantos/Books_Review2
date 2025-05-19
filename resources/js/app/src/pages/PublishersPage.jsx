// src/pages/BooksPage.jsx
import React, { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../services/bookService";
import BookForm from "../components/Books/BookForm";
import BookList from "../components/Books/BookList";