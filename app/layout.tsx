export const metadata = {
  title: "AI Meme Generator",
  description: "Upload an image, get an AI caption, and download the meme."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="max-w-4xl mx-auto p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">AI Meme Generator</h1>
            <p className="opacity-80">Upload an image · Get a caption · Download the meme</p>
          </header>
          {children}
          <footer className="mt-12 opacity-70 text-sm">Built with Next.js + Tailwind.</footer>
        </div>
      </body>
    </html>
  );
}
