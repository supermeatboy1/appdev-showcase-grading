import { useNavigate, useLocation } from "react-router-dom";

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

const Grading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [grades, setGrades] = useState({});
  const [scoresConfirmed, setScoresConfirmed] = useState(false);
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
          <h2 className="text-blue-300 text-2xl pb-4">Welcome, {location.state?.fullName}!</h2>
          <Button type="button" onClick={() => navigate("/score_view")}>View All Scores</Button>
        </div>
        <div className="m-auto">
          <div className="flex flex-row justify-center">
            <ProjectsTable projects={projects} grades={grades} setGrades={setGrades} />
          </div>
          <div className="px-6 pb-10 flex flex-row justify-between">
            <label>
              <input type="checkbox" value={scoresConfirmed} onChange={(e) => setScoresConfirmed(e.target.checked)} />
              <span className="text-blue-200 pl-3">I confirm that my tabulation of scores is final.</span>
            </label>
            <Button
              type="button"
              color={!scoresConfirmed ? "bg-gray-500/90" : null}
              textColor={!scoresConfirmed ? "text-gray-400/80" : null}
              onClick={() => {}}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Grading
