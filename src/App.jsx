import { useEffect, useState } from 'react'

function App() {
  const [todos, setTodos] = useState(()=>{
    const savedtodo = localStorage.getItem("todos")
    return savedtodo? JSON.parse(savedtodo) : []; 
  })
  const [input, setInput] = useState("")
  const [editingIndex, setEditingIndex] = useState(null)
  const [editingText, setEditingText] = useState("")

  useEffect(() =>{
    localStorage.setItem("todos",JSON.stringify(todos))
  },[todos])

  const addtodo = () => {
    if (input.trim() === "") return;
    setTodos([...todos, { text: input, completed: false }])
    setInput("")
  }

  const deletetodo = (index) => {
    setTodos(todos.filter((todo, i) => i !== index))
  }

  const toggletodo = (index) => {
    setTodos(todos.map((todo, i) => 
      i === index ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const startEditing = (index) => {
  if (todos[index].completed) return;
  setEditingIndex(index)
  setEditingText(todos[index].text)
  }
  
  const saveEdit = () => {
    if (editingText.trim() === "") return;
    setTodos(todos.map((todo, i) => 
      i === editingIndex ? { ...todo, text: editingText } : todo
    ))
    setEditingIndex(null)
    setEditingText("")
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditingText("")
  }

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Todo Manager
            </h1>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Add a new task..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addtodo()}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-gray-700 placeholder-gray-400 mb-4"
          />
          <button 
            onClick={addtodo}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            Add Task
          </button>

        </div>

        {/* Empty State */}
        {todos.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-xl">📝</span>
            </div>
            <p className="text-gray-500 font-medium">No tasks yet</p>
            <p className="text-gray-400 text-sm">Add your first task above</p>
          </div>
        )}

        {/* Todo List */}
        {todos.length > 0 && (
          <div className="space-y-3">
            {todos.map((todo, index) => (
              <div 
                key={index}
                className={`group bg-white border-2 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01] ${
                  todo.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <button 
                    onClick={() => toggletodo(index)}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                      todo.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                    }`}
                  >
                    {todo.completed && (
                      <span className="text-sm font-bold">✓</span>
                    )}
                  </button> 

                  {/* Todo Text or Input */}
                  <div className="flex-1">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        onBlur={saveEdit}
                        autoFocus
                        className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500 text-gray-800 font-medium"
                      />
                    ) : (
                      <span 
                        className={`font-medium transition-all duration-200 ${
                          todo.completed 
                            ? 'line-through text-green-600' 
                            : 'text-gray-800'
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                      todo.completed 
                        ? 'bg-green-100 text-green-700' 
                        : editingIndex === index  
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'

                    }`}
                  >
                    {editingIndex === index ? 'Editing' : todo.completed ? 'Done' : 'Active'}
                  
                  </span>

                  {/* Delete Button */}
                  {editingIndex === index ? (
                    <div className="flex gap-1">
                      <button 
                        onClick={saveEdit}
                        className="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700 rounded-full transition-all duration-200 flex items-center justify-center text-sm font-bold"
                        title="Save (Enter)"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="w-8 h-8 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 rounded-full transition-all duration-200 flex items-center justify-center text-sm font-bold"
                        title="Cancel (Esc)"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button 
                        onClick={() => startEditing(index)}
                        className={`opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center text-sm font-bold ${
                          todo.completed 
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                            : 'bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-500'
                        }`}                        
                        title={todo.completed ? "Cannot edit completed task" : "Edit"}
                      >
                        ✎
                      </button>

                  <button 
                    onClick={() => deletetodo(index)}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 rounded-full transition-all duration-200 flex items-center justify-center text-sm font-bold"
                  >
                    ×
                  </button>
                </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}


        {/* Stats */}
        {todos.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-600">{todos.length}</div>
                <div className="text-blue-700 text-xs font-medium">Total</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
                <div className="text-lg font-bold text-green-600">
                  {todos.filter(todo => todo.completed).length}
                </div>
                <div className="text-green-700 text-xs font-medium">Done</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
                <div className="text-lg font-bold text-purple-600">
                  {todos.filter(todo => !todo.completed).length}
                </div>
                <div className="text-purple-700 text-xs font-medium">Left</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App