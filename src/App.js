import siteHeader from "./components/SiteHeader.html?raw";
import heroSection from "./components/sections/HeroSection.html?raw";
import painSection from "./components/sections/PainSection.html?raw";
import architectureSection from "./components/sections/ArchitectureSection.html?raw";
import ecosystemSection from "./components/sections/EcosystemSection.html?raw";
import ontologySection from "./components/sections/OntologySection.html?raw";
import knowledgeFabricOntologyVideoSection from "./components/sections/KnowledgeFabricOntologyVideoSection.html?raw";
import ontologyStudioSection from "./components/sections/OntologyStudioSection.html?raw";
import marketplaceSection from "./components/sections/MarketplaceSection.html?raw";
import factorySection from "./components/sections/FactorySection.html?raw";
import agentFactoryVideoSection from "./components/sections/AgentFactoryVideoSection.html?raw";
import itemGptSection from "./components/sections/ItemGptSection.html?raw";
import wmsShipOrderVideoSection from "./components/sections/WmsShipOrderVideoSection.html?raw";
import fmsTicketResponseVideoSection from "./components/sections/FmsTicketResponseVideoSection.html?raw";
import itemGptAdminSection from "./components/sections/ItemGptAdminSection.html?raw";
import trainingCatalogSection from "./components/sections/TrainingCatalogSection.html?raw";
import audienceTrainingSection from "./components/sections/AudienceTrainingSection.html?raw";
import deliveryTrainingSection from "./components/sections/DeliveryTrainingSection.html?raw";
import bootcampTrainingSection from "./components/sections/BootcampTrainingSection.html?raw";
import operationsTrainingSection from "./components/sections/OperationsTrainingSection.html?raw";

const sections = [
  heroSection,
  painSection,
  architectureSection,
  ecosystemSection,
  ontologySection,
  ontologyStudioSection,
  knowledgeFabricOntologyVideoSection,
  marketplaceSection,
  factorySection,
  agentFactoryVideoSection,
  itemGptSection,
  wmsShipOrderVideoSection,
  fmsTicketResponseVideoSection,
  itemGptAdminSection,
  trainingCatalogSection,
  audienceTrainingSection,
  deliveryTrainingSection,
  bootcampTrainingSection,
  operationsTrainingSection,
];

/** Root-absolute asset references are rebased onto the deploy base (Pages sub-path). */
const withBase = (html) => html.replaceAll('"/assets/', `"${import.meta.env.BASE_URL}assets/`);

export function renderApp(container) {
  container.innerHTML = withBase(`${siteHeader}<main>${sections.join("\n")}</main>`);
}
