"use client"

import { Button } from "./ui/button"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="bg-[#1e3a3a] py-20 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-yellow-400">"</span> ProjectHub: Connecting Students with Transformative Projects{" "}
            <span className="text-yellow-400">"</span>
          </motion.h1>
          <motion.p
            className="text-xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            A ground-breaking initiative that empowers students through collaborative projects, mentorship, and
            real-world experience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button className="bg-[#6b3e7c] hover:bg-[#5a2e6b] text-white px-8 py-6 text-lg rounded-lg">
              Read More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
