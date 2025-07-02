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

//import { createClient } from '@supabase/supabase-js'

//const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY)

const Index = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="m-auto">
          <div className="flex flex-row justify-center pb-16">
            <h1 className="text-yellow-300 text-4xl"></h1>
          </div>
          <div className="flex flex-row justify-center">
          </div>
          <div className="p-10">
            <CriteriaInputTable />
            <div className="py-5 place-self-end">
              <Button type="button" onClick={() => {}}>Record Grade</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
