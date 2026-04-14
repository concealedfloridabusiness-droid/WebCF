import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import HomePage from "@/pages/HomePage";
import WeAreReady from "@/pages/WeAreReady";
import WeAreWatching from "@/pages/WeAreWatching";
import WeAreHiding from "@/pages/WeAreHiding";
import HidingHolsters from "@/pages/HidingHolsters";
import HidingEdc from "@/pages/HidingEdc";
import HidingClothing from "@/pages/HidingClothing";
import ContactPage from "@/pages/ContactPage";
import AboutPage from "@/pages/AboutPage";
import PhysicalFitness from "@/pages/PhysicalFitness";
import FirstAid from "@/pages/FirstAid";
import PreparednessOverview from "@/pages/PreparednessOverview";
import PlanningPage from "@/pages/PlanningPage";
import PreppingPage from "@/pages/PreppingPage";
import PrepVideosPage from "@/pages/PrepVideosPage";
import CommunicationPage from "@/pages/CommunicationPage";
import FitnessMale from "@/pages/FitnessMale";
import FitnessFemale from "@/pages/FitnessFemale";
import MapPage from "@/pages/MapPage";
import NewsPage from "@/pages/NewsPage";
import AwarenessPage from "@/pages/AwarenessPage";
import MedKitPage from "@/pages/MedKitPage";
import FirearmTraining from "@/pages/FirearmTraining";
import TrainingVideosPage from "@/pages/TrainingVideosPage";
import FirstAidVideosPage from "@/pages/FirstAidVideosPage";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(function () {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/we-are-ready" component={WeAreReady} />
      <Route path="/we-are-watching" component={WeAreWatching} />
      <Route path="/we-are-hiding" component={WeAreHiding} />
      <Route path="/we-are-hiding/holsters" component={HidingHolsters} />
      <Route path="/we-are-hiding/edc-gear" component={HidingEdc} />
      <Route path="/we-are-hiding/clothing" component={HidingClothing} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/fitness" component={PhysicalFitness} />
      <Route path="/first-aid" component={FirstAid} />
      <Route path="/preparedness" component={PreparednessOverview} />
      <Route path="/preparedness/planning" component={PlanningPage} />
      <Route path="/preparedness/prepping/videos" component={PrepVideosPage} />
      <Route path="/preparedness/prepping" component={PreppingPage} />
      <Route path="/preparedness/communication" component={CommunicationPage} />
      <Route path="/fitness/male" component={FitnessMale} />
      <Route path="/fitness/female" component={FitnessFemale} />
      <Route path="/we-are-watching/map" component={MapPage} />
      <Route path="/we-are-watching/news" component={NewsPage} />
      <Route path="/we-are-watching/awareness" component={AwarenessPage} />
      <Route path="/first-aid/kit/:tier" component={MedKitPage} />
      <Route path="/first-aid/videos" component={FirstAidVideosPage} />
      <Route path="/training/firearm" component={FirearmTraining} />
      <Route path="/training/videos" component={TrainingVideosPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(function () {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ScrollToTop />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
