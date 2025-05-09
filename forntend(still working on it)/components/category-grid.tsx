"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const categories = [
  { name: "Artificial Intelligence", color: "bg-[#f39c12]" },
  { name: "Machine Learning", color: "bg-[#4a9f5e]" },
  { name: "Data Science", color: "bg-[#e74c3c]" },
  { name: "Web Development", color: "bg-[#3498db]" },
  { name: "Mobile App Development", color: "bg-[#e84393]" },
  { name: "Cybersecurity", color: "bg-[#1abc9c]" },
  { name: "Cloud Computing", color: "bg-[#9b59b6]" },
  { name: "Blockchain", color: "bg-[#2ecc71]" },
  { name: "Internet of Things", color: "bg-[#e67e22]" },
]

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
          whileHover={{ scale: 1.03 }}
        >
          <Link
            href={`/projects?category=${category.name.toLowerCase().replace(/\s+/g, "-")}`}
            className={`${category.color} rounded-xl p-8 text-white font-bold text-xl hover:opacity-90 transition-opacity block h-full flex items-center justify-center text-center`}
          >
            {category.name}
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
