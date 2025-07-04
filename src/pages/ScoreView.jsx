import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'

import Button from '../components/Button.jsx';
import ScoreTable from "../components/ScoreTable";

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY)

const ScoreView = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [grades, setGrades] = useState([]);

  const fetchData = async () => {
    let projectsData = [];
    {
      let { data, error } = await supabase
        .from('ProjectsWithCategories')
        .select("*")
      for (const { id, category, title, category_name } of data) {
        projectsData[id] = { category, title, category_name, grades: [] };
      }
    }

    let { data, error } = await supabase
      .from('Grading')
      .select("*");

    data.sort((a, b) => a.panelist_id - b.panelist_id);

    for (const { project_id, panelist_id, grade } of data) {
      projectsData[project_id].grades.push(grade);
    }

    console.log("Full project data with grades:")

    for (const [id, project] of Object.entries(projectsData)) {
      console.log(project)
    }

    setProjects(projectsData)
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-900 w-min">
        <div className="flex flex-row justify-center pt-16 pb-8">
          <h2 className="text-blue-300 text-2xl">Projects Score Table:</h2>
        </div>
        <div className="p-8 justify-items-center">
          <Button type="button" onClick={() => navigate("/")}>Go Back</Button>
        </div>
        <ScoreTable projects={projects} />
      </div>
    </>
  )
}
export default ScoreView
