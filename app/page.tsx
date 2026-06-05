import Header from "./components/Header";
import Nav from "./components/Nav";
import UniformsCont from "./components/UniformsCont";


function App() {

  return (
    <div className="flex flex-col items-center justify-around min-h-screen bg-gray-50 text-gray-800">
      {/* Navigation Bar */}
      <Nav />

      {/* Hero / Header Section */}
      <section id="home" className="w-full">
        <Header />
      </section>

      {/* Section Title */}
      <h1 className="text-2xl md:text-3xl font-semibold mt-8 mb-6 text-center text-purple-700">
        Uniforms
      </h1>

      {/* Main Content */}
      <section id="uniforms" className="w-full mt-6">
        <UniformsCont  />
      </section>

      {/* Footer (Optional) */}
      <footer className="mt-10 py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} UniformPal — All Rights Reserved
      </footer>
    </div>
  );
}

export default App;
