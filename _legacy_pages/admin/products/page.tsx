"use client";

import { motion } from "framer-motion";
import { products } from "@/lib/utils";
import { Edit, Trash2, Plus } from "lucide-react";

export default function AdminProductsPage() {
    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-display mb-1">Products</h1>
                        <p className="text-text-muted text-sm">Manage your product catalog</p>
                    </div>
                    <button className="btn-rose !text-sm"><Plus size={16} /> Add Product</button>
                </div>
            </motion.div>

            <div className="glass-card p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-text-muted border-b border-white/5">
                                <th className="text-left pb-3 font-medium">Product</th>
                                <th className="text-left pb-3 font-medium">Category</th>
                                <th className="text-left pb-3 font-medium">Price</th>
                                <th className="text-left pb-3 font-medium">Rating</th>
                                <th className="text-left pb-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id} className="border-b border-white/5">
                                    <td className="py-3 font-medium">{p.name}</td>
                                    <td className="py-3"><span className="px-2 py-1 rounded-full text-[10px] bg-accent-rose/10 text-accent-rose capitalize font-semibold">{p.category}</span></td>
                                    <td className="py-3 text-text-muted">{p.price} {p.currency}</td>
                                    <td className="py-3 text-text-muted">⭐ {p.rating}</td>
                                    <td className="py-3">
                                        <div className="flex gap-2">
                                            <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"><Edit size={14} className="text-text-muted" /></button>
                                            <button className="p-1.5 rounded-lg hover:bg-red-900/20 transition-colors"><Trash2 size={14} className="text-red-400" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
