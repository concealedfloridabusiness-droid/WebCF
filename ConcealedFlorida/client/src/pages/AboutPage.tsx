import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

export default function AboutPage() {
  return (
    <>
      <SEOHead 
        title="About Us & Privacy Policy - Concealed Florida"
        description="Learn about Concealed Florida's core beliefs and our commitment to your privacy."
        path="/about"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold text-white mb-8" data-testid="text-page-title">About Us</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Our Core Beliefs</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                At Concealed Florida, we believe in empowering individuals with the knowledge, skills, and mindset 
                necessary to protect themselves and their loved ones. Our mission is built on three fundamental pillars:
              </p>
              
              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">We Are Ready</h3>
                  <p className="text-gray-400">
                    We believe in being physically and mentally prepared for any situation. This means maintaining 
                    peak physical fitness, mastering life-saving skills, and developing proficiency in self-defense 
                    techniques to protect those who matter most.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">We Are Watching</h3>
                  <p className="text-gray-400">
                    Situational awareness is paramount to personal safety. We advocate for understanding local laws, 
                    recognizing potential threats, and maintaining constant vigilance to navigate the world safely 
                    and responsibly.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">We Are Hiding in Plain Sight</h3>
                  <p className="text-gray-400">
                    True preparedness doesn't draw attention. We promote practical, discreet everyday-carry solutions 
                    that provide security without compromising your daily routine or drawing unnecessary attention.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-800 pt-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Privacy Policy</h2>
            <div className="space-y-4 text-gray-300">
              <p className="text-sm text-gray-400">
                <strong>Last Updated:</strong> January 2025
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Information Collection</h3>
                  <p className="text-gray-400">
                    Concealed Florida is a purely informational website. We do not collect, store, or process any 
                    personal information from our visitors. We do not use cookies, tracking pixels, or any other 
                    data collection mechanisms.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Information Use</h3>
                  <p className="text-gray-400">
                    Since we do not collect any personal information, we do not use, share, or sell any user data 
                    to third parties. Your visit to our website is completely anonymous.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Third-Party Links</h3>
                  <p className="text-gray-400">
                    Our website may contain links to external sites. We are not responsible for the privacy practices 
                    or content of these third-party websites. We encourage you to review their privacy policies before 
                    providing any personal information.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Content Disclaimer</h3>
                  <p className="text-gray-400">
                    All information provided on Concealed Florida is for educational and informational purposes only. 
                    This content does not constitute legal, medical, or professional advice. Always consult with 
                    qualified professionals for specific guidance related to your situation.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Changes to This Policy</h3>
                  <p className="text-gray-400">
                    We reserve the right to update this privacy policy at any time. Any changes will be posted on 
                    this page with an updated revision date.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Contact Information</h3>
                  <p className="text-gray-400">
                    If you have any questions about this privacy policy, please contact us at{" "}
                    <a href="mailto:info@concealedflorida.com" className="text-white hover:underline">
                      info@concealedflorida.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
