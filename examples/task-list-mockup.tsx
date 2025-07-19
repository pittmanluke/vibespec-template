// This is an example mockup for demonstrating the /transpose command
// Save your UI designs here and use /transpose to convert them to specifications

export default function TaskListMockup() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + New Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 border-b">
        <button className="pb-2 px-1 border-b-2 border-blue-600 font-medium">
          All (12)
        </button>
        <button className="pb-2 px-1 text-gray-600 hover:text-gray-900">
          Active (8)
        </button>
        <button className="pb-2 px-1 text-gray-600 hover:text-gray-900">
          Completed (4)
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {/* Task Item - Active */}
        <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition">
          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded" />
            <div className="flex-1">
              <h3 className="font-medium">Review pull request #123</h3>
              <p className="text-sm text-gray-600 mt-1">
                Check the new authentication implementation
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  High Priority
                </span>
                <span className="text-gray-500">Due today</span>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Task Item - Completed */}
        <div className="p-4 bg-gray-50 border rounded-lg opacity-75">
          <div className="flex items-start gap-3">
            <input type="checkbox" checked className="mt-1 w-4 h-4 rounded" />
            <div className="flex-1">
              <h3 className="font-medium line-through text-gray-600">
                Update documentation
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-through">
                Add API endpoints to the README
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="text-gray-500">Completed 2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* More tasks... */}
      </div>

      {/* Empty State (shown when no tasks) */}
      <div className="hidden text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h3>
        <p className="text-gray-600">Create your first task to get started</p>
      </div>
    </div>
  );
}