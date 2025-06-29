import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Zoom lens state
  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const lensSize = 150; // px
  const zoom = 2; // magnification

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:5001/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLensPos({ x, y });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center text-red-500">Product not found</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <div
        className="relative w-full h-64 mb-4"
        onMouseEnter={() => setShowLens(true)}
        onMouseLeave={() => setShowLens(false)}
        onMouseMove={handleMouseMove}
        style={{ width: "100%", height: "256px" }}
      >
        <img
          ref={imgRef}
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg"
          style={{ display: "block" }}
        />
        {showLens && (
          <div
            style={{
              position: "absolute",
              pointerEvents: "none",
              left: lensPos.x - lensSize / 2,
              top: lensPos.y - lensSize / 2,
              width: lensSize,
              height: lensSize,
              borderRadius: "50%",
              border: "2px solid #fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              backgroundImage: `url(${product.imageUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${imgRef.current?.offsetWidth * zoom}px ${imgRef.current?.offsetHeight * zoom}px`,
              backgroundPosition: `-${lensPos.x * zoom - lensSize / 2}px -${lensPos.y * zoom - lensSize / 2}px`,
              zIndex: 10,
            }}
          />
        )}
      </div>
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-pink-600 font-semibold text-lg mb-2">₹{product.price}</p>
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-gray-500 text-sm mb-2">Category: {product.category}</p>
      <a
        href={product.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        View on Store
      </a>
    </div>
  );
}