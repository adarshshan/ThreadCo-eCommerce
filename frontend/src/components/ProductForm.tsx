import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import type { Product } from "../types/Product";

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Omit<Product, "_id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState<File | null | undefined>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setCategory(product.category);
      setStock(product.stock);
      setImage(null); // Reset image as it's not part of the original product
    } else {
      setName("");
      setPrice(0);
      setDescription("");
      setCategory("");
      setStock(0);
      setImage(null);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, price, description, category, stock, image });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log("................file............");
    console.log(file);
    setImage(file);
  };

  return (
    <Paper
      elevation={3}
      className="p-6 w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg"
    >
      <Typography
        variant="h5"
        className="font-bold text-gray-800 mb-6 text-center"
      >
        {product ? "Edit Product" : "Add Product"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="name"
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          fullWidth
          required
          className="rounded-md"
          InputProps={{
            className: "text-gray-700",
          }}
          InputLabelProps={{
            className: "text-gray-600",
          }}
        />
        <TextField
          id="price"
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          variant="outlined"
          fullWidth
          required
          className="rounded-md"
          InputProps={{
            className: "text-gray-700",
          }}
          InputLabelProps={{
            className: "text-gray-600",
          }}
        />
        <TextField
          id="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          className="rounded-md"
          InputProps={{
            className: "text-gray-700",
          }}
          InputLabelProps={{
            className: "text-gray-600",
          }}
        />
        <TextField
          id="category"
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          variant="outlined"
          fullWidth
          required
          className="rounded-md"
          InputProps={{
            className: "text-gray-700",
          }}
          InputLabelProps={{
            className: "text-gray-600",
          }}
        />
        <TextField
          id="stock"
          label="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          variant="outlined"
          fullWidth
          required
          className="rounded-md"
          InputProps={{
            className: "text-gray-700",
          }}
          InputLabelProps={{
            className: "text-gray-600",
          }}
        />
        <Box>
          <Typography
            variant="body1"
            className="text-gray-600 font-semibold mb-2"
          >
            Product Image
          </Typography>
          <input
            id="image"
            type="file"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </Box>
        <Box className="flex justify-between mt-6">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Save
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            className="border-gray-500 text-gray-700 hover:bg-gray-100 font-bold py-2 px-4 rounded-md"
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductForm;
