import { useNavigate } from "react-router-dom";

import { useState, useEffect, useRef } from 'react'

/*
import ConfirmationModal from "../components/ConfirmationModal";
import ErrorDialogModal from "../components/ErrorDialogModal";
import LoadingModal from "../components/LoadingModal";
import DialogModal from "../components/DialogModal";
*/
import Button from '../components/Button.jsx';
import ProjectsTable from "../components/ProjectsTable";

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY)

const Index = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [grades, setGrades] = useState({});
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const categoryId = 2;

  const fetchProjects = async (teamId) => {
      const { data, error } = await supabase
        .from('Projects')
        .select("*")
        .eq("category", 2)
      console.log("Projects data:")
      console.log(data)
      setProjects(data)
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  /*
  const recordGrade = async (e) => {
    e.preventDefault();
    console.log(inputs);

    console.log("Recording grades...");

    const { error } = await supabase
      .from('Grading')
      .insert({ team_id: 1, project_type: "Mobile App",
                grade: {
                  design: +inputs.design,
                  usability: +inputs.usability,
                  functionality: +inputs.functionality,
                  installation: +inputs.installation,
                }
              });

    if (error) {
      console.log(error["code"] + " - " + error["message"]);
    } else {
      console.log("Grading successful!");
    }
  }
  */

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-900 w-min">
        <div className="p-8 justify-items-center w-screen">
          <Button type="button" onClick={() => navigate("/score_view")}>View All Scores</Button>
        </div>
        <div className="m-auto">
          <div className="flex flex-row justify-center">
            <ProjectsTable projects={projects} grades={grades} setGrades={setGrades} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
