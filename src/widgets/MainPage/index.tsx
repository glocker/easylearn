import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/outline";

interface Course {
  id: string;
  title: string;
  description: string;
}

interface MainPageProps {
  courses: Course[];
}

export const MainPage = ({ courses }: MainPageProps) => (
  <div className="min-h-screen bg-gray-900">
    <div className="container mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <input
            type="search"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200 placeholder-gray-400 [color-scheme:dark]"
            placeholder="Поиск курсов..."
          />
          <span className="absolute right-3 top-2.5">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex justify-end mb-6">
        <select className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg w-48 border border-gray-700 focus:ring-2 focus:ring-blue-500 [color-scheme:dark]">
          <option value="" className="bg-gray-800 text-gray-200">
            All Categories
          </option>
          {/* filter options */}
        </select>
      </div>

      {/* List of courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-200 mb-2 hover:text-blue-400">
              {course.title}
            </h3>
            <p className="text-gray-300">{course.description}</p>
            <textarea
              className="w-full mt-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200 placeholder-gray-400 !text-gray-200"
              placeholder="Введите текст..."
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);
