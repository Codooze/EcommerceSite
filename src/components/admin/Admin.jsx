// import React, { useState } from "react";
// import useSWR from "swr";

// const baseUrl = "http://localhost:5000/categories";

// const fetchData = async (url) => {
//   const response = await fetch(url);
//   const data = await response.json();
//   return data;
// };

// export default function admin() {
//   const {
//     data: categories,
//     error: categoriesError,
//     mutate,
//   } = useSWR(baseUrl, fetchData);

//   if (error) return <div>failed to load</div>;
//   if (!data) return <div>loading...</div>;

//   return (
//     <>
//       <h1>admin</h1>
//       {categories.map((category) => (
//         <div key={category.title}>
//           <h2>{category.title}</h2>
//           <ul>
//             {category.items.map((product) => (
//               <li key={product.id}>
//                 <input type="text" value={product.name} />
//                 <input type="number" value={product.price} />
//                 <input type="text" value={product.imageUrl} />
//               </li>
//                 }}
//     </>
//   );
// }

import React, { useState } from "react";
import useSWR from "swr";

const baseUrl = "http://localhost:5000/categories";

const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const performPostRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

const performPutRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export const Admin = () => {
  const {
    data: categories,
    error: categoriesError,
    mutate,
  } = useSWR(baseUrl, fetchData);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState(0);
  const [newProductImageUrl, setNewProductImageUrl] = useState("");

  if (categoriesError) {
    return <div>Error loading categories</div>;
  }

  if (!categories) {
    return <div>Loading categories...</div>;
  }

  const handleAddProduct = async (categoryTitle) => {
    const category = categories.find(
      (category) => category.title === categoryTitle
    );
    const newProduct = {
      id: Date.now(),
      name: newProductName,
      imageUrl: newProductImageUrl,
      price: newProductPrice,
    };
    const updatedCategory = {
      ...category,
      items: [...category.items, newProduct],
    };
    const updatedCategories = categories.map((category) =>
      category.title === categoryTitle ? updatedCategory : category
    );
    mutate(updatedCategories, false);

    await performPostRequest(
      `${baseUrl}/${categoryTitle.toLowerCase()}/items`,
      newProduct
    );

    // Clear input fields after adding the product
    setNewProductName("");
    setNewProductPrice(0);
    setNewProductImageUrl("");
  };

  const handleUpdateProduct = async (
    categoryTitle,
    productId,
    updatedFields
  ) => {
    const category = categories.find(
      (category) => category.title === categoryTitle
    );

    const updatedItems = category.items.map((item) => {
      if (item.id === productId) {
        return { ...item, ...updatedFields };
      } else {
        return item;
      }
    });

    const updatedCategory = {
      ...category,
      items: updatedItems,
    };

    const updatedCategories = categories.map((category) =>
      category.title === categoryTitle ? updatedCategory : category
    );

    mutate(updatedCategories, false);

    // Create the payload with all properties
    const updatedProduct = {
      name:
        updatedFields.name ||
        category.items.find((item) => item.id === productId).name,
      price:
        updatedFields.price ||
        category.items.find((item) => item.id === productId).price,
      imageUrl:
        updatedFields.imageUrl ||
        category.items.find((item) => item.id === productId).imageUrl,
    };

    await performPutRequest(
      `${baseUrl}/${categoryTitle.toLowerCase()}/items/${productId}`,
      updatedProduct
    );
  };

  const handleInlineUpdate = (categoryTitle, itemId, field, value) => {
    handleUpdateProduct(categoryTitle, itemId, { [field]: value });
  };

  return (
    <div>
      <h1>Admin</h1>
      {categories.map((category) => (
        <div key={category.title}>
          <h2>{category.title}</h2>
          <ul>
            {category.items.map((item) => (
              <li key={item.id}>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleInlineUpdate(
                      category.title,
                      item.id,
                      "name",
                      e.target.value
                    )
                  }
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    handleInlineUpdate(
                      category.title,
                      item.id,
                      "price",
                      e.target.value
                    )
                  }
                />
                <button
                  onClick={() =>
                    handleUpdateProduct(category.title, item.id, {
                      name: "Updated Name",
                    })
                  }
                >
                  Update Name
                </button>
                <button
                  onClick={() =>
                    handleUpdateProduct(category.title, item.id, { price: 999 })
                  }
                >
                  Update Price
                </button>
                <button
                  onClick={() =>
                    handleUpdateProduct(category.title, item.id, {
                      imageUrl: "https://example.com/new-image.png",
                    })
                  }
                >
                  Update Image
                </button>
              </li>
            ))}
          </ul>
          <div>
            <h3>Add New Product</h3>
            <input
              type="text"
              placeholder="Product Name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProductImageUrl}
              onChange={(e) => setNewProductImageUrl(e.target.value)}
            />
            <button onClick={() => handleAddProduct(category.title)}>
              Add Product
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Admin;
