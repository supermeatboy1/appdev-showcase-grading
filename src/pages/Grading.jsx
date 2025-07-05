import { useNavigate, useLocation } from "react-router-dom";

import { useState, useEffect, useRef } from 'react'

/*
import ConfirmationModal from "../components/ConfirmationModal";
import LoadingModal from "../components/LoadingModal";
*/
import Button from '../components/Button';
import DialogModal from "../components/DialogModal";
import ErrorDialogModal from "../components/ErrorDialogModal";
import ProjectsTable from "../components/ProjectsTable";

import { sha256 } from 'js-sha256';
import { createClient } from '@supabase/supabase-js';
import { criteria } from "../Const.js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY)

const Grading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [errorLog, setErrorLog] = useState(null);
  const [grades, setGrades] = useState({});
  const [awards, setAwards] = useState({});
  const [scoresConfirmed, setScoresConfirmed] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [sessionConfirmed, setSessionConfirmed] = useState(null);
  const [editable, setEditable] = useState(true);
  const [successModal, setSuccessModal] = useState(false);
  const categoryId = location.state?.categoryId || 0;

  const loadPreviousTabulations = async (gradingData) => {
    let newGrades = {};
    for (var i = gradingData.length - 1; i >= 0; i--) {
      const dbGrade = gradingData[i];
      newGrades[dbGrade.project_id] = dbGrade.grade;
    }
    setGrades(newGrades);

    let { data, error } = await supabase
      .from('Awards')
      .select("*")
      .eq("awarded_by", location.state?.userId)
    if (error) {
      console.log(error["code"] + " - " + error["message"]);
      return
    }

    let newAwards = {};
    for (var i = data.length - 1; i >= 0; i--) {
      const dbAward = data[i];
      newAwards[dbAward.award_name] = dbAward.project_id;
    }
    setAwards(newAwards)
  }

  const confirmSession = async () => {
    let { data, error } = await supabase
      .from('Credentials')
      .select("*")
      .eq("username", location.state?.username)
    if (error) {
      console.log(error["code"] + " - " + error["message"]);
      return
    }
    if (data.length == 1 && data[0].session_id == sha256(location.state?.sessionId)) {
      let { data, error } = await supabase
        .from('Grading')
        .select("*")
        .eq("panelist_id", location.state?.userId)
      if (error) {
        console.log(error["code"] + " - " + error["message"]);
        return
      }
      if (data.length > 0) {
        console.log("This user has already tabulated.");
        setEditable(false);
        setScoresConfirmed(true);
        loadPreviousTabulations(data);
      }
      console.log("Session confirmed!");
      setSessionConfirmed(true);
      fetchProjects();
    }
  }

  const fetchProjects = async (teamId) => {
      const { data, error } = await supabase
        .from('Projects')
        .select("*")
        .eq("category", categoryId)
      console.log("Projects data:")
      console.log(data)
      setProjects(data)
  }

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = 'Are you sure you want to leave? Your changes may not be saved.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    confirmSession();
  }, []);

  const recordGrade = async (e) => {
    if (!scoresConfirmed || !editable) {
      return
    }

    console.log("Recording grades...");

    let inputData = [];

    if (Object.entries(grades).length > 0) {

      for (const [id, grade] of Object.entries(grades)) {
        criteria.forEach((criteria, index) => {
          if (!(criteria.dbName in grade)) {
            grade[criteria.dbName] = 0;
          }
        });
        inputData.push({
          project_id: id, 
          panelist_id: location.state?.userId,
          grade
        });
      }

      if (inputData.length == 0) {
        setErrorLog("You haven't recorded any grades yet!");
        return
      }

      console.log("Uploading grades...");
      console.log(inputData);

      const { error } = await supabase
        .from('Grading')
        .insert(inputData);

      if (error) {
        setErrorLog(error["code"] + " - " + error["message"]);
        return;
      }
    }

    inputData = [];

    if (Object.entries(awards).length > 0) {
      for (const [dbName, projectId] of Object.entries(awards)) {
        inputData.push({
          project_id: projectId, 
          awarded_by: location.state?.userId,
          award_name: dbName,
        });
      }

      console.log("Uploading awards...");
      console.log(inputData);

      const { error } = await supabase
        .from('Awards')
        .insert(inputData);

      if (error) {
        setErrorLog(error["code"] + " - " + error["message"]);
        return;
      }
    }

    setSuccessModal(true);
    setHasUnsavedChanges(false);
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-900 w-min">
        { sessionConfirmed &&
          <>
          <div className="p-8 justify-items-center w-screen">
            <h2 className="text-blue-300 text-2xl pb-4">Welcome, {location.state?.fullName}!</h2>
            { !editable && <h2 className="text-blue-300 text-1xl pb-4">Tabulation submitted.</h2> }
            <Button type="button" onClick={() => navigate("/score_view")}>View All Scores</Button>
          </div>
          <div className="m-auto">
            <div className="flex flex-row overflow-auto max-w-screen">
              <ProjectsTable
                projects={projects}
                grades={grades}
                setGrades={setGrades}
                setHasUnsavedChanges={setHasUnsavedChanges}
                editable={editable}
                categoryId={categoryId}
                awards={awards}
                setAwards={setAwards} />
            </div>
            <div className="px-6 pt-3 pb-30 flex flex-row justify-between">
              <label>
                <input type="checkbox" value={scoresConfirmed} onChange={(e) => {
                  if (editable) {
                    setScoresConfirmed(e.target.checked)}
                  }
                } />
                <span className="text-blue-200 px-3">I confirm that my tabulation of scores is final.</span>
              </label>
              <Button
                type="button"
                color={!scoresConfirmed || !editable ? "bg-gray-500/90" : null}
                textColor={!scoresConfirmed || !editable ? "text-gray-400/80" : null}
                onClick={recordGrade}
              >
                Confirm
              </Button>
            </div>

        <a 
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify({
                    "grades": grades,
                    "awards": awards,
                  })
                )}`}
                download={`scores-${location.state?.username}.json`}
                className={"flex justify-center items-center gap-2 text-white bg-blue-400/70 hover:bg-orange-300/40" +
                " font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer"}>
            Download and Backup Scores
        </a>
          </div>
          </>
        }
      </div>
      {errorLog != null && (
          <ErrorDialogModal
              buttonText='Ok'
              message='An error occured. Please check the error message below.' 
              errorLog={errorLog}
              onClick={() => setErrorLog(null) }
          />
      )}
      {successModal && (
          <DialogModal
              buttonText='Ok'
              message='Scores recorded.' 
              onClick={() => {
                setEditable(false);
                setSuccessModal(false);
              }}
          />
      )}
    </>
  )
}

export default Grading
