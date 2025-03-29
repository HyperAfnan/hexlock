import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Dashboard from "./dashboard"
import Landing from "./landing"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/*" element={<Landing />} />
      </Routes>
    </Router>
  )
}

export default App
