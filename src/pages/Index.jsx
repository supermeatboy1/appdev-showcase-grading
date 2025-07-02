import { useNavigate } from "react-router-dom";

import { useState, useEffect, useRef } from 'react'

/*
import ConfirmationModal from "../components/ConfirmationModal";
import ErrorDialogModal from "../components/ErrorDialogModal";
import LoadingModal from "../components/LoadingModal";
import DialogModal from "../components/DialogModal";
*/
import Button from '../components/Button.jsx';
import CriteriaInputTable from "../components/CriteriaInputTable";
import GradesTable from "../components/GradesTable";

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY)

const Index = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "Team Upstagers!",
    design: "",
    usability: "",
    functionality: "",
    installation: "",
  });
  const [grades, setGrades] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentTeamId, setCurrentTeamId] = useState(null);

  const fetchGrades = async (teamId) => {
      const { data, error } = await supabase
        .from('Grading')
        .select("grade")
        .eq('team_id', teamId || currentTeamId)
      console.log("Grades data:")
      console.log(data)
      setGrades(data)
  }
  const fetchTeams = async () => {
      const { data, error } = await supabase
        .from('Teams')
        .select("id, name")
      console.log("Teams data:")
      console.log(data)
      setTeams(data)
  }

  useEffect(() => {
    fetchTeams();
  }, []);

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

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-900">
        <div className="m-auto">
          <div className="flex flex-row justify-center pt-16 pb-8">
            <h2 className="text-blue-300 text-4xl">Select Team:</h2>
            { teams.length > 0 && <select
              id="team"
              name="team"
              value={currentTeamId}
              onChange={async (e) => {
                if (e.target.value == "") {
                  setCurrentTeamId(null);
                  return;
                }
                setCurrentTeamId(e.target.value);
                setInputs({
                  ...inputs,
                  name: `Team ${e.target.options[e.target.selectedIndex].text}`
                });
                fetchGrades(e.target.value);
              }}
              className="block w-64 px-4 mx-4 py-2 text-sm text-gray-100 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Choose --</option>
              { teams.map((entry, index) => {return (
                  <option value={entry.id}>{entry.name}</option>
              )})}
            </select> }
          </div>
          {
            currentTeamId != null && <>
              <div className="flex flex-row justify-center">
                <GradesTable grades={grades} />
              </div>
              <div className="p-10">
                <CriteriaInputTable inputs={inputs} setInputs={setInputs} />
                <div className="py-5 place-self-end">
                  <Button type="button" onClick={recordGrade}>Record Grade</Button>
                </div>
              </div>
            </>
          }
        </div>
      </div>
    </>
  )
}

export default Index
