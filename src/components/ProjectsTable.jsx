import EditableCell from "../components/EditableCell";
import { criteria } from "../Const.js";

const ProjectsTable = ({ projects, grades, setGrades, setHasUnsavedChanges, editable }) => {
  const handleCellSave = (id, field, newValue) => {
    if (isNaN(Number(newValue)) || Number(newValue) < 0 || Number(newValue) > 10) {
      return;
    }

    console.log(`Changing cell ${field} for ${id}`)
    setGrades(prevGrades => {
      const updatedGrades = {};

      for (const [id, grade] of Object.entries(prevGrades)) {
        updatedGrades[id] = grade
      }

      if (!(id in updatedGrades)) {
        if (newValue > 0) {
          updatedGrades[id] = {[field]: +newValue};
          setHasUnsavedChanges(true);
        }
      } else {
        updatedGrades[id] = prevGrades[id];
        if (!(field in updatedGrades[id])) {
          updatedGrades[id][field] = {};
        }
        updatedGrades[id][field] = +newValue;
        setHasUnsavedChanges(true);
      }

      return updatedGrades;
    });
  };

  return (
    <div className="p-4 bg-gray-900 text-gray-100">
      <table className="min-w-full border border-gray-700 text-sm text-left bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-700 text-gray-200">
          <tr>
            <th className="px-4 py-2 border border-gray-700">ID</th>
            <th className="px-4 py-2 border border-gray-700">Project Title</th>
            {
              criteria.map((criterion, _index) => (
                <th className="px-4 py-2 border border-gray-700">{criterion.properName}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            projects.map((entry, index) => {
              return (
                <tr key={index} 
                  className={`${entry.id in grades ? (Object.keys(grades[entry.id]).length == criteria.length ? "bg-lime-700" : "bg-yellow-700") : index % 2 == 0 ? "bg-gray-800" : "bg-gray-700"} order-b border-gray-700`}
                >
                  <td className="px-4 py-2 border border-gray-700 text-center">{entry.id}</td>
                  <td className="px-4 py-2 border border-gray-700 text-center">{entry.title}</td>
                  {
                    criteria.map((criterion, _index) => {
                      const grade = grades[entry.id] && grades[entry.id][criterion.dbName] ? grades[entry.id][criterion.dbName] : 0
                      return (
                        <td className="border border-gray-700 text-center">
                          <EditableCell
                            value={grade}
                            onSave={(newValue) => handleCellSave(entry.id, [criterion.dbName], newValue)}
                            editable={editable}
                          />
                        </td>
                      )
                    })
                  }
                </tr>
               )
            })
          }
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
