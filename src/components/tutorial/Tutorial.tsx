"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "@/app/tutorial.css";
import { useAppStore } from "@/state/store";

export function Tutorial() {
  const [hasRun, setHasRun] = useState(false);
  const deals = useAppStore((s) => s.deals);
  const createDeal = useAppStore((s) => s.createDeal);

  useEffect(() => {
    // Check if user has seen tutorial
    const hasSeenTutorial = localStorage.getItem("dealquary_tutorial_completed");

    if (!hasSeenTutorial && !hasRun) {
      // Auto-create first deal if none exists
      if (deals.length === 0) {
        createDeal();
      }

      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const driverObj = driver({
          showProgress: true,
          showButtons: ['next', 'previous', 'close'],
          progressText: 'Step {{current}} of {{total}}',
          popoverClass: 'dealquary-tutorial-popover',
          steps: [
            {
              element: '[data-tutorial="deal-name"]',
              popover: {
                title: 'Deal Name',
                description: 'Give your deal a name',
                side: 'bottom',
                align: 'start',
              }
            },
            {
              element: '[data-tutorial="deal-shape"]',
              popover: {
                title: 'Deal Shape',
                description: "Fill in your deal's shape - contract length and billing cadence",
                side: 'right',
                align: 'start',
              }
            },
            {
              element: '[data-tutorial="products"]',
              popover: {
                title: 'Products',
                description: 'Add what products will be in your deal',
                side: 'right',
                align: 'start',
              }
            },
            {
              element: '[data-tutorial="deal-economics"]',
              popover: {
                title: 'Deal Economics',
                description: 'If you have any advanced metrics like CAC, free months, or ramp periods - add them here',
                side: 'right',
                align: 'start',
              }
            },
            {
              element: '[data-tutorial="deal-metrics"]',
              popover: {
                title: 'Deal Metrics & Actions',
                description: 'Check out your deal metrics, compare to another deal, and export to share!',
                side: 'left',
                align: 'start',
              }
            },
          ],
          onDestroyStarted: () => {
            // Mark tutorial as completed when user closes it
            localStorage.setItem("dealquary_tutorial_completed", "true");
            driverObj.destroy();
          },
        });

        driverObj.drive();
        setHasRun(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [hasRun, deals.length, createDeal]);

  return null;
}

export function restartTutorial() {
  localStorage.removeItem("dealquary_tutorial_completed");
  window.location.reload();
}
