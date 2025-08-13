import React, { useEffect, useState } from 'react';
import { History, LogOut, Youtube, Send, X } from 'lucide-react';
import { Spinner } from './ui/Spinner.jsx';
import { SignedIn, useAccessToken, useSignOut, useUserId } from '@nhost/react';

export function VideoSummaryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ ytSummary, setYtSummary] = useState('');
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const { signOut } = useSignOut();
  const accessToken = useAccessToken();
  const userId = useUserId();

  useEffect(() => {
    if (!url) {
      setVideoId('');
      return;
    }

    let id = '';
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/,
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/shorts\/)([\w-]{11})/, // For YouTube Shorts
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/live\/)([\w-]{11})/ // For YouTube Live URLs (can sometimes have a video ID)
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        id = match[1];
        setVideoId(id);
        break;
      }
    }
    
    console.log(videoId);
  }, [url]);

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

   const handleAISummary = async (transcript) => {
    try {
      const response = await fetch('https://wjrjdxentwfwpiqnwlph.hasura.ap-south-1.nhost.run/api/rest/processgemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-role': 'user',
          'authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
              "input": {
                  "contents": [
                    {
                      "parts": [
                        {
                          "text": "Please analyze the transcript of the youtube video and create a structured summary following these guidelines: Break down the content into main topics using numbers. Do not use any markdown feautes. Do not use highlight, bold, italics or anything. Only use numbers like 1. or for smaller point 1.2 etc. Please provide a clear, structured summary that captures the core concepts while maintaining accuracy. Transcript: " + transcript
                        }
                      ]
                    }
                  ]
                }
        })
      });

      const result = await response.json();

      if(!result?.actionGemini?.candidates[0]?.content?.parts[0]?.text){
        alert('There was an error in creating the summary. Try again later!');
        return;
      }

      else if(result?.actionGemini?.candidates[0]?.content?.parts[0]?.text){
        setYtSummary(result?.actionGemini?.candidates[0]?.content?.parts[0]?.text);
        return;
      }

      else{
        alert('An Unknow error occured while creating summary.')
        throw new Error('Unknown error occured with summary');
      }
    } 
    catch(err){
      console.log(err);
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    if (!videoId.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://wjrjdxentwfwpiqnwlph.hasura.ap-south-1.nhost.run/api/rest/processtranscript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-role': 'user',
          'authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          "videoID": videoId
        })
      });

      const result = await response.json();

      if(result?.actionTranscript?.success===false){
        alert('There was an error in transcripting the video. Try again later or with a different video!');
        return;
      }

      else if(result?.actionTranscript?.success===true){
        await handleAISummary(result?.actionTranscript?.transcript);
      }

      else{
        alert('An Unknow error occured while transcripting.')
        throw new Error('Unknown error occured transcripting');
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
    <SignedIn>
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="glass fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-[#FF0000] hover:opacity-80 transition-opacity">
            <svg width="24px" height="24px" viewBox="0 -3 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>youtube [#ff0000168]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-300.000000, -7442.000000)" fill="#ff0000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M251.988432,7291.58588 L251.988432,7285.97425 C253.980638,7286.91168 255.523602,7287.8172 257.348463,7288.79353 C255.843351,7289.62824 253.980638,7290.56468 251.988432,7291.58588 M263.090998,7283.18289 C262.747343,7282.73013 262.161634,7282.37809 261.538073,7282.26141 C259.705243,7281.91336 248.270974,7281.91237 246.439141,7282.26141 C245.939097,7282.35515 245.493839,7282.58153 245.111335,7282.93357 C243.49964,7284.42947 244.004664,7292.45151 244.393145,7293.75096 C244.556505,7294.31342 244.767679,7294.71931 245.033639,7294.98558 C245.376298,7295.33761 245.845463,7295.57995 246.384355,7295.68865 C247.893451,7296.0008 255.668037,7296.17532 261.506198,7295.73552 C262.044094,7295.64178 262.520231,7295.39147 262.895762,7295.02447 C264.385932,7293.53455 264.28433,7285.06174 263.090998,7283.18289" id="youtube-[#ff0000168]"> </path> </g> </g> </g> </g></svg>
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
    </SignedIn>
  );
}