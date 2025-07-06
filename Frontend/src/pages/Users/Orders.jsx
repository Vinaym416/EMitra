import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/ui/Header";
import BottomNav from "../../components/ui/ButtomNav";
import { axiosInstance } from "../../lib/axios";

export default function Orders() {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Orders");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (!authUser) {
      toast.error("Please login to view your orders.");
      navigate("/products");
      return;
    }

    async function fetchOrders() {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("orders/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res || res.status !== 200) throw new Error("Failed to fetch orders");

        setOrders(res.data);
      } catch (err) {
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [authUser, navigate]);

  // Remove cart items if user returns to /products
  useEffect(() => {
    const unlisten = navigate((location) => {
      if (location.pathname === "/products") {
        localStorage.removeItem("cartItems");
      }
    });
    return () => {
      if (typeof unlisten === "function") unlisten();
    };
  }, [navigate]);

  const mapStatus = (status) => {
    if (status === "Delivered") return "Delivered";
    if (status === "Cancelled") return "Cancelled";
    // Treat both Processing and Shipped as Pending for UI
    if (status === "Processing" || status === "Shipped") return "Pending";
    return status;
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Orders") return mapStatus(order.status) === "Pending";
    return mapStatus(order.status) === statusFilter;
  });

  const handleInvoiceDownload = (order) => {
    const content = `Order ID: ${order.id}
Date: ${new Date(order.date).toLocaleDateString()}
Status: ${order.status}
Total: ₹${order.total}

Items:
${order.items
      .map((item) => `- ${item.name} × ${item.quantity}`)
      .join("\n")}`;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `invoice-${order.id}.txt`;
    link.click();
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.patch(
        `orders/${orderId}`,
        { status: "Cancelled" }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      toast.success("Order cancelled successfully.");
    } catch (err) {
      toast.error("Failed to cancel order.");
    }
  };

  // Reorder: add items to cartItems and go to /checkout
  const handleReorder = (order) => {
    const cartItems = order.items.map(item => ({
      id: item.productId || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      category: item.category || "",
    }));
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    navigate("/checkout");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-20 sm:px-6">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
      Your Orders
    </h2>

    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
      {["Orders", "Delivered", "Cancelled", "All"].map((status) => (
        <button
          key={status}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            statusFilter === status
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setStatusFilter(status)}
        >
          {status}
        </button>
      ))}
    </div>

    {loading ? (
      <div className="text-center py-10 text-blue-700 font-medium">
        Loading your orders...
      </div>
    ) : filteredOrders.length === 0 ? (
      <p className="text-center text-gray-500">
        No orders found for selected filter.
      </p>
    ) : (
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="border bg-white shadow-md rounded-xl p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-800">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-sm">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 px-0.5">Status</p>
               
                <span
                  className={`inline-block px-0.5 py-1 rounded-md text-xs font-medium ${
                    mapStatus(order.status) === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : mapStatus(order.status) === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {mapStatus(order.status)}
                </span>
                
              </div>
            </div>

            <div className="text-right mt-3">
              <button
                className="text-blue-600 text-sm font-medium hover:underline"
                onClick={() =>
                  setExpandedOrderId(
                    expandedOrderId === order.id ? null : order.id
                  )
                }
              >
                {expandedOrderId === order.id ? "Hide Details" : "View Details"}
              </button>
            </div>

            {expandedOrderId === order.id && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium mb-2">Items</h4>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right text-blue-800 font-semibold text-lg">
                  Total: ₹{order.total}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => handleInvoiceDownload(order)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
                  >
                    Download Invoice
                  </button>
                  {(order.status === "Processing" || order.status === "Shipped") && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm"
                    >
                      Cancel
                    </button>
                  )}
                  {order.status === "Cancelled" && (
                    <button
                      onClick={() => handleReorder(order)}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm"
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
</div>
      <BottomNav />
    </>
  );
}