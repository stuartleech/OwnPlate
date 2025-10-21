import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            🍽️ OwnPlate
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            Your sustainable meal planning companion
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Replace wasteful meal kits with smart recipe planning. Save money, reduce plastic waste, 
            and cook with quality ingredients you choose.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-200"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-3 rounded-lg border-2 border-gray-300 transition duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Manage Recipes</h3>
            <p className="text-gray-600">
              Add your favorite vegetarian recipes or import them via CSV. Build your personal recipe collection.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🗓️</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Plan Your Week</h3>
            <p className="text-gray-600">
              Select 5 dinners each week. Get smart suggestions based on ingredients you already have.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Smart Shopping Lists</h3>
            <p className="text-gray-600">
              Auto-generated lists that combine quantities and separate fresh items from pantry staples.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why OwnPlate?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="text-2xl">♻️</div>
              <div>
                <h4 className="font-semibold mb-1 text-gray-900">Reduce Waste</h4>
                <p className="text-gray-600">No more single-use sauce sachets or excessive plastic packaging</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">💰</div>
              <div>
                <h4 className="font-semibold mb-1 text-gray-900">Save Money</h4>
                <p className="text-gray-600">Buy quality ingredients yourself at better prices</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">🥬</div>
              <div>
                <h4 className="font-semibold mb-1 text-gray-900">Quality Control</h4>
                <p className="text-gray-600">Choose exactly the ingredients and brands you trust</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h4 className="font-semibold mb-1 text-gray-900">Smart Pantry</h4>
                <p className="text-gray-600">Track staples and use them across multiple recipes</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your meals?</h2>
          <Link
            href="/register"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-12 py-4 rounded-lg text-lg transition duration-200"
          >
            Start Planning Today
          </Link>
        </div>
      </div>
    </div>
  );
}
