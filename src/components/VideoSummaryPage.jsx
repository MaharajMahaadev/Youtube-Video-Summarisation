import React, { useEffect, useState } from 'react';
import { History, LogOut, Youtube, Send, X } from 'lucide-react';
import { Spinner } from './ui/Spinner.jsx';
import { useAccessToken, useSignOut, useUserId } from '@nhost/react';

export function VideoSummaryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ ytSummary, setYtSummary] = useState('');
  const [url, setUrl] = useState('');
  const { signOut } = useSignOut();
  const accessToken = useAccessToken();
  const userId = useUserId();

  async function insertSummaries(){
    try{
      const res = await fetch('https://wjrjdxentwfwpiqnwlph.hasura.ap-south-1.nhost.run/api/rest/summaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-role': 'user',
          'authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          "object":{
              "summary": ytSummary,
              "url": url,
              "timestamp": new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000).toISOString().replace('Z', '000'),
              "user_id": userId,
          }
        })
      });

      const data = await res.json();
      
      setSummaries(prev => [data?.insert_summaries_one, ...prev]);
      setCurrentSummary(data?.insert_summaries_one);
      setUrl('');
    }

    catch(err){
      console.log('Error in inserting summaries to database', err);
    }
  }

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://wjrjdxentwfwpiqnwlph.hasura.ap-south-1.nhost.run/v1/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-role': 'user',
          'authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          "query": "mutation MyCustomActionMutation($arg1: SampleInput!){ actionName(arg1: $arg1) {message} }",
          "variables": { "arg1":{"ytube": url}}
        })
      });

      const result = await response.json();

      if(result?.data?.actionName?.message==='AI model failed to run'){
        alert('There was an error in processing, Please try again!');
        return;
      }

      else if(result?.data?.actionName?.message){
        console.log(result?.data?.actionName?.message);
        setYtSummary(result?.data?.actionName?.message);
      }

      else{
        alert('An Unknow error occured.')
        throw new Error('Unknown error occured');
      }
    } 
    catch(err){
      console.log(err);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(ytSummary!==''){
      insertSummaries();
    }
  }, [ytSummary]);

  async function getSummaries(){
    if(summaries.length===0){
      try{
      const res = await fetch('https://wjrjdxentwfwpiqnwlph.hasura.ap-south-1.nhost.run/api/rest/summaries', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-role': 'user',
          'authorization': `Bearer ${accessToken}`
        }
      });

      const data = await res.json();
      setSummaries(data?.summaries);
    }
    catch(err){
      console.log("Error in fetching user summaries: ", err);
    }
    }
    }

  useEffect(() => {
    getSummaries();
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="glass fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-[#FF0000] hover:opacity-80 transition-opacity">
            <Youtube size={24} />
          </a>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-white/30 rounded-full transition-colors"
            >
              <History size={20} className="text-[#282828]" />
            </button>
            <button
              onClick={signOut}
              className="p-2 hover:bg-white/30 rounded-full transition-colors"
            >
              <LogOut size={20} className="text-[#282828]" />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-24 px-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleVideoSubmit} className="glass rounded-xl p-6 mb-8">
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube video URL here..."
                className="w-full px-4 py-3 pr-12 rounded-lg bg-white/50 border border-white/20 focus:ring-2 focus:ring-[#FF0000] outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FF0000] text-white p-2 rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-70"
              >
                {isLoading ? <Spinner size="sm" /> : <Send size={20} />}
              </button>
            </div>
          </form>

          {isLoading ? (
            <div className="glass rounded-xl p-8 text-center">
              <Spinner size="lg" className="mx-auto mb-4" />
              <p className="text-[#282828]/70">Analyzing video content...</p>
            </div>
          ) : currentSummary && (
            <div className="glass rounded-xl p-8">
              <h2 className="text-xl font-semibold text-[#282828] mb-4">{currentSummary.title}</h2>
              <a
                href={currentSummary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF0000] hover:underline text-sm mb-4 block"
              >
                {currentSummary.url}
              </a>
              <p className="text-[#282828]/70 whitespace-pre-wrap">{currentSummary.summary}</p>
            </div>
          )}
        </div>
      </main>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full glass w-80 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50 shadow-2xl`}
      >
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={20} className="text-[#282828]" />
            <h2 className="text-lg font-semibold text-[#282828]">History</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-white/30 rounded-full transition-colors"
          >
            <X size={20} className="text-[#282828]" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {summaries.map((summary) => (
            <button
              key={summary?.id}
              onClick={() => {
                setCurrentSummary(summary);
                setIsSidebarOpen(false);
              }}
              className="w-full p-4 text-left hover:bg-white/30 border-b border-white/20 transition-colors"
            >
              <h3 className="font-medium text-[#282828] truncate">Link: {summary?.url.slice(-11)}</h3>
              <p className="text-sm text-[#282828]/70 mt-1 line-clamp-2">{summary?.summary.slice(0,100)}</p>
              <span className="text-xs text-[#282828]/50 mt-2 block">
                {new Date(summary?.timestamp).toLocaleString('in')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}