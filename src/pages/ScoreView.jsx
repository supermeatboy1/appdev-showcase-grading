import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'

import Button from '../components/Button.jsx';
import ScoreTable from "../components/ScoreTable";

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY)

const ScoreView = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);

  const fetchGrades = async () => {
    const { data, error } = await supabase
      .from('Grading')
      .select("grade")
    console.log("Grades data:")
    console.log(data)
    setGrades(data)
  }

  useEffect(() => {
    fetchGrades();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-900">
        <div className="flex flex-row justify-center pt-16 pb-8">
          <h2 className="text-blue-300 text-4xl">Average Grades per Team:</h2>
        </div>
        <div className="p-8 justify-items-center">
          <Button type="button" onClick={() => navigate("/")}>Go Back</Button>
        </div>
        <ScoreTable grades={grades} />
      </div>
    </>
  )
}
export default ScoreView
