/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: template strings used in default code examples */
/** biome-ignore-all lint/suspicious/noConsole: console.log needed for debugging job execution */
'use client';
import { useAuth, useClerk } from '@clerk/nextjs';
import Editor from '@monaco-editor/react';
import { Code2, Loader2, Play, Square, Terminal } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { createJob, getJob, type Job } from '@/services/jobService';

const languages = [
  { value: 'python', label: 'Python', extension: '.py' },
  { value: 'javascript', label: 'JavaScript', extension: '.js' },
  { value: 'typescript', label: 'TypeScript', extension: '.ts' },
  { value: 'java', label: 'Java', extension: '.java' },
  { value: 'csharp', label: 'C#', extension: '.cs' },
  { value: 'go', label: 'Go', extension: '.go' },
];

const defaultCode: Record<string, string> = {
  python:
    'print("Hello from Python!")\n\n# Write your Python code here\nfor i in range(5):\n print(f"Count: {i}")',
  javascript:
    'console.log("Hello from JavaScript!");\n\n// Write your JavaScript code here\nfor (let i = 0; i < 5; i++) {\n console.log(`Count: ${i}`);\n}',
  typescript:
    'console.log("Hello from TypeScript!");\n\n// Write your TypeScript code here\nfor (let i: number = 0; i < 5; i++) {\n console.log(`Count: ${i}`);\n}',
  java: 'public class Main {\n public static void main(String[] args) {\n System.out.println("Hello from Java!");\n \n // Write your Java code here\n for (int i = 0; i < 5; i++) {\n System.out.println("Count: " + i);\n }\n }\n}',
  csharp:
    'using System;\n\nclass Program {\n static void Main() {\n Console.WriteLine("Hello from C#!");\n \n // Write your C# code here\n for (int i = 0; i < 5; i++) {\n Console.WriteLine($"Count: {i}");\n }\n }\n}',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n fmt.Println("Hello from Go!")\n \n // Write your Go code here\n for i := 0; i < 5; i++ {\n fmt.Printf("Count: %d\\n", i)\n }\n}',
};

export default function PlaygroundPage() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(defaultCode.python);
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(defaultCode[newLanguage] || '');
    setJob(null); // Clear previous output when language changes
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    setJob(null);
    const token = await getToken();
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const newJob = await createJob(language, code, token);
      setJob(newJob);
      // Poll for job completion
      const interval = setInterval(async () => {
        try {
          const jobResult = await getJob(newJob.job_id, token);
          if (
            jobResult.status === 'completed' ||
            jobResult.status === 'failed'
          ) {
            clearInterval(interval);
            setJob(jobResult);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error polling for job status:', error);
          clearInterval(interval);
          setIsLoading(false);
        }
      }, 2000);
    } catch (error) {
      console.error('Error running code:', error);
      setIsLoading(false);
    }
  };

  const handleStopExecution = () => {
    setIsLoading(false);
    // You might want to implement actual job cancellation here
  };

  const { theme } = useTheme();
  const clerk = useClerk();
  const currentLanguage = languages.find((lang) => lang.value === language);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-3">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Select onValueChange={handleLanguageChange} value={language}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
        {/* Code Editor Section */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-lg border border-border bg-card text-card-foreground shadow-sm">
          <div className="flex-shrink-0 rounded-t-lg border-b p-6">
            <div className="flex items-center justify-between gap-2 font-medium text-base">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                code_editor{currentLanguage?.extension}
              </div>
              <div className="-mt-2 flex items-center gap-2">
                {isLoading ? (
                  <Button
                    className="gap-2"
                    onClick={handleStopExecution}
                    size="sm"
                    variant="destructive"
                  >
                    <Square className="h-4 w-4" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    className="gap-2"
                    disabled={!code.trim()}
                    onClick={handleRunCode}
                    size="sm"
                  >
                    <Play className="h-4 w-4" />
                    Run
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col rounded-b-lg bg-[#1e1e1e]">
            <div className="flex-1 overflow-hidden rounded-b-lg">
              {clerk.loaded && (
                <Editor
                  height="100%"
                  language={language}
                  onChange={(value) => setCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    disableLayerHinting: true,
                    tabSize: 2,
                    wordWrap: 'on',
                  }}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                  value={code}
                  width="100%"
                />
              )}
            </div>
          </div>
        </div>
        {/* Output Section */}
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col rounded-lg border border-border bg-card text-card-foreground shadow-sm lg:w-96 lg:flex-none">
          <div className="flex-shrink-0 rounded-t-lg border-b p-6">
            <div className="flex items-center gap-2 font-medium text-base">
              <Terminal className="h-4 w-4" />
              output
              {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>
          <div className="min-h-0 flex-1 rounded-b-lg bg-[#1e1e1e] p-0">
            <div className="flex h-full min-h-0 flex-col rounded-b-lg">
              {isLoading && !job && (
                <div className="flex flex-1 items-center justify-center bg-muted/20">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Executing...
                  </div>
                </div>
              )}
              {job && (
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="flex-shrink-0 border-b px-2 py-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-muted-foreground text-xs">
                        {job.job_id}
                      </span>
                      <Badge
                        className="text-xs"
                        variant={(() => {
                          if (job.status === 'completed') {
                            return 'default';
                          }
                          if (job.status === 'failed') {
                            return 'destructive';
                          }
                          return 'secondary';
                        })()}
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                    {job.stdout && (
                      <div className="p-2">
                        <div className="mb-1 text-green-600 text-xs dark:text-green-400">
                          stdout
                        </div>
                        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
                          {job.stdout}
                        </pre>
                      </div>
                    )}
                    {job.stderr && (
                      <>
                        {job.stdout && <Separator />}
                        <div className="p-2">
                          <div className="mb-1 text-red-600 text-xs dark:text-red-400">
                            stderr
                          </div>
                          <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-red-600 text-sm leading-relaxed dark:text-red-400">
                            {job.stderr}
                          </pre>
                        </div>
                      </>
                    )}
                    {!(job.stdout || job.stderr) &&
                      job.status === 'completed' && (
                        <div className="flex flex-1 items-center justify-center p-2 text-muted-foreground text-sm">
                          No output
                        </div>
                      )}
                  </div>
                </div>
              )}
              {!(job || isLoading) && (
                <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
                  Run code to see output
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
