
import Layout from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { aiTools } from "@/data/aiTools";

const Tools = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
            Explore AI Tools
          </h2>
          <p className="text-xl text-slate-600 mt-4 max-w-2xl mx-auto">
            Find the best AI tools to help you with any task. Here's a list of all available tools.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Tools;
