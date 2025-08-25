'use client';

import { ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TextRotate from '@/components/text-rotate';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const bannerDismissed = localStorage.getItem('ignis-banner-dismissed');
    if (!bannerDismissed) {
      setShowBanner(true);
    }
  }, []);

  const dismissBanner = () => {
    localStorage.setItem('ignis-banner-dismissed', 'true');
    setShowBanner(false);
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {showBanner && (
        <div className="relative bg-gradient-to-r from-orange-600 to-red-600 px-4 py-3 text-white">
          <div className="container mx-auto text-center">
            <p className="font-medium text-sm">
              📢 Important: The hosted version of Ignis is currently not
              available. Self-hosting is straightforward and fully documented in
              our blog.
            </p>
          </div>
          <button
            className="-translate-y-1/2 absolute top-1/2 right-4 transform rounded-full p-1 hover:bg-white/20"
            onClick={dismissBanner}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="border-border border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-orange-500">
              <span className="font-bold text-sm text-white">🔥</span>
            </div>
            <span className="font-semibold text-foreground text-lg">Ignis</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              className="text-muted-foreground hover:bg-accent hover:text-foreground"
              size="sm"
              variant="ghost"
            >
              Sign In
            </Button>
            <Button
              className="bg-transparent text-orange-500 hover:bg-accent hover:text-orange-500"
              size="sm"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="mb-6">
            <span className="mb-4 inline-flex items-center rounded-full border border-orange-800 bg-orange-900/30 px-3 py-1 font-medium text-orange-300 text-sm">
              🔥 Powered by Firecracker
            </span>
          </div>
          <h1 className="mb-8 font-bold text-5xl text-foreground leading-tight md:text-7xl">
            Code Execution
            <span className="block">Made Simple</span>
          </h1>
          <div className="mb-14 text-muted-foreground text-xl leading-relaxed md:text-2xl">
            Open-source,{' '}
            <TextRotate
              animate={{ y: 0 }}
              exit={{ y: '-120%' }}
              initial={{ y: '100%' }}
              mainClassName="inline-block"
              rotationInterval={4000}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              staggerDuration={0.05}
              staggerFrom={'last'}
              texts={['robust', 'fast', 'scalable', 'sandboxed']}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            />{' '}
            online code execution system for humans and AI.
          </div>
          <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-orange-500 bg-accent px-10 py-6 font-medium text-lg text-orange-500 outline-none transition-all hover:bg-accent hover:text-orange-500 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-4 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
              href={'/playground'}
            >
              Try Playground <ArrowRight />
            </Link>
            <Link
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border bg-transparent px-10 py-6 font-medium text-lg text-muted-foreground outline-none transition-all hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-4 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
              href={'/api-keys'}
            >
              Get API Key
            </Link>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="font-bold text-3xl text-foreground">
                &lt; 250ms
              </div>
              <div className="text-muted-foreground text-sm">
                Cold start time (for python)
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl text-foreground">50%</div>
              <div className="text-muted-foreground text-sm">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl text-foreground">10+</div>
              <div className="text-muted-foreground text-sm">
                Executions daily (Maybe)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-4 text-center font-bold text-3xl text-foreground md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mb-12 text-center text-muted-foreground text-xl">
            Everything you need to know about Ignis and secure code execution.
          </p>
          <Accordion className="w-full space-y-4" collapsible type="single">
            <AccordionItem
              className="rounded-lg border border-border bg-card/50 px-6"
              value="item-1"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-orange-400">
                What is Firecracker?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Firecracker is an open-source virtualization technology
                developed by Amazon Web Services (AWS) that powers services such
                as AWS Lambda and AWS Fargate. It enables the creation of
                lightweight micro-virtual machines (microVMs) that boot in under
                100 milliseconds, offering robust security isolation through
                hardware-level virtualization while minimizing overhead.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              className="rounded-lg border border-border bg-card/50 px-6"
              value="item-2"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-orange-400">
                How secure is code execution?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Each code execution in Ignis occurs within its own isolated
                microVM, enforced by Firecracker's hypervisor. This provides
                hardware-level separation between executions, combined with
                strict resource limits on CPU, memory, and runtime, ensuring
                protection against vulnerabilities and unauthorized access.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              className="rounded-lg border border-border bg-card/50 px-6"
              value="item-3"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-orange-400">
                What programming languages are supported?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We support popular languages including Python,
                JavaScript/Node.js, Go, Rust, and more. Each language runs in a
                pre-configured environment with common libraries available.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              className="rounded-lg border border-border bg-card/50 px-6"
              value="item-5"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-orange-400">
                How do I get started?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Start with our interactive playground to test the platform, then
                sign up for an API key to integrate secure code execution into
                your applications. Full documentation and examples are provided.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              className="rounded-lg border border-border bg-card/50 px-6"
              value="item-6"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-orange-400">
                Why is Ignis not hosted online as a managed service?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Hosting Firecracker-based systems requires nested virtualization
                support, which is currently available only on select cloud
                providers like Digital Ocean. To prioritize flexibility,
                accessibility, and cost-efficiency for users, Ignis is designed
                for self-hosting rather than a centralized managed service at
                this time.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border border-t bg-card/30 px-4 py-8">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded border border-orange-500">
              <span className="font-bold text-white text-xs">🔥</span>
            </div>
            <span className="font-semibold text-foreground">Ignis</span>
          </div>
          <p className="mb-4 text-muted-foreground text-sm">
            Secure code execution powered by Firecracker technology.
          </p>
          <p className="text-muted-foreground/70 text-xs">
            &copy; {new Date().getFullYear()} Ignis. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
