const ScoreTable = ({ grades }) => {
  const sumOfCriterion = (criterionName) => {
    return Math.round(grades.reduce((accumulator, entry) => accumulator + entry.grade[criterionName], 0) / grades.length, 2);
  }
  return (
    <div className="p-4 bg-gray-900 text-gray-100">
      <table className="min-w-full border border-gray-700 text-sm text-left bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-700 text-gray-200">
          <tr>
            <th className="px-4 py-2 border border-gray-700">Team Name</th>
            <th className="px-4 py-2 border border-gray-700">Design</th>
            <th className="px-4 py-2 border border-gray-700">Usability</th>
            <th className="px-4 py-2 border border-gray-700">Functionality</th>
            <th className="px-4 py-2 border border-gray-700">Ease of Installation</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((entry, index) => {
            const grade = entry.grade
            return (
              <tr key={index} className="bg-gray-800 border-b border-gray-700">
                <td className="px-4 py-2 border border-gray-700 text-center">{"Team Upstagers"}</td>
                <td className="px-4 py-2 border border-gray-700 text-center">{grade.design}</td>
                <td className="px-4 py-2 border border-gray-700 text-center">{grade.usability}</td>
                <td className="px-4 py-2 border border-gray-700 text-center">{grade.functionality}</td>
                <td className="px-4 py-2 border border-gray-700 text-center">{grade.installation}</td>
              </tr>
             )
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
