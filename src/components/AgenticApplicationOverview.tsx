import { useEffect, useRef } from "react";
import "./AgenticApplicationOverview.css";

export function AgenticApplicationOverview() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function fitSlide() {
      if (!stageRef.current) return;
      const stage = stageRef.current;
      const container = stage.parentElement;
      if (!container) return;
      const scale = Math.min(container.clientWidth / 1600, container.clientHeight / 900) * 0.97;
      stage.style.transform = `translate(-50%,-50%) scale(${scale})`;
      stage.classList.add('ready');
    }
    window.addEventListener('resize', fitSlide);
    const ro = new ResizeObserver(fitSlide);
    if (stageRef.current?.parentElement) {
      ro.observe(stageRef.current.parentElement);
    }
    fitSlide();
    return () => {
      window.removeEventListener('resize', fitSlide);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="arch-container">
      <div className="slide-stage" id="stage" ref={stageRef}>


  <div className="arch-head">
    <div className="t">
      <i className="ti ti-hierarchy-3"></i>
      <div>
        <h1>Agentic AI application architecture — DT components, backend agents, and hybrid AI briefing</h1>
        <div className="sub">DT components monitor and display state → backend agents analyze, predict, simulate, and decide → HybridAIAdvisor produces the final summary / briefing</div>
      </div>
    </div>
    <div className="arch-legend">
      <span><i className="dot" style={{background: '#5aa0ff'}}></i>Data flow</span>
      <span><i className="dot" style={{background: '#4fd394'}}></i>Normal state</span>
      <span><i className="dot" style={{background: '#f2b04a'}}></i>Prediction</span>
      <span><i className="dot" style={{background: '#ef6b68'}}></i>Critical</span>
      <span><i className="dot" style={{background: '#a48af5'}}></i>Digital twin</span>
    </div>
  </div>

  {/* WIRES (drawn under boxes) */}
  <svg className="arch-wires">
    <defs>
      <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M1 1L8 5L1 9" fill="none" stroke="#2f6fed" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </marker>
      <marker id="arrp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M1 1L8 5L1 9" fill="none" stroke="#6b4fd6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </marker>
    </defs>

    {/* inter-stage arrows */}
    <line className="flow-fast" x1="192" y1="470" x2="219" y2="470" stroke="#2f6fed" strokeWidth="2" markerEnd="url(#arr)"/>
    <line className="flow-fast" x1="428" y1="470" x2="463" y2="470" stroke="#2f6fed" strokeWidth="2" markerEnd="url(#arr)"/>
    <line className="flow-fast" x1="965" y1="470" x2="1009" y2="470" stroke="#2f6fed" strokeWidth="2" markerEnd="url(#arr)"/>
    <line className="flow-fast" x1="1228" y1="470" x2="1249" y2="470" stroke="#2f6fed" strokeWidth="2" markerEnd="url(#arr)"/>
    <line className="flow-fast" x1="1424" y1="470" x2="1449" y2="470" stroke="#2f6fed" strokeWidth="2" markerEnd="url(#arr)"/>

    {/* feedback loop, orthogonal routing back to physical environment */}
    <path className="flow-loop" d="M1516 600 L1516 800 L106 800 L106 674" fill="none" stroke="#6b4fd6" strokeWidth="2" markerEnd="url(#arrp)"/>

    {/* digital twin pentagon flow */}
    <line className="flow-med" x1="743" y1="280" x2="887" y2="385" stroke="#6b4fd6" strokeWidth="1.8" markerEnd="url(#arrp)"/>
    <line className="flow-med" x1="904" y1="438" x2="849" y2="607" stroke="#6b4fd6" strokeWidth="1.8" markerEnd="url(#arrp)"/>
    <line className="flow-med" x1="804" y1="640" x2="626" y2="640" stroke="#6b4fd6" strokeWidth="1.8" markerEnd="url(#arrp)"/>
    <line className="flow-med" x1="581" y1="607" x2="526" y2="438" stroke="#6b4fd6" strokeWidth="1.8" markerEnd="url(#arrp)"/>
    <line className="flow-med" x1="543" y1="385" x2="687" y2="280" stroke="#6b4fd6" strokeWidth="1.8" markerEnd="url(#arrp)"/>
  </svg>

  {/* flow labels: leader lines down to a readable pill band below the cards */}
  <div className="arch-leader-line" style={{left: '207px', top: '470px', height: '242px'}}></div>
  <div className="arch-leader-line" style={{left: '440px', top: '470px', height: '242px'}}></div>
  <div className="arch-leader-line" style={{left: '1000px', top: '470px', height: '242px'}}></div>
  <div className="arch-leader-line" style={{left: '1240px', top: '470px', height: '242px'}}></div>
  <div className="arch-leader-line" style={{left: '1438px', top: '470px', height: '242px'}}></div>

  <div className="arch-flow-pill" style={{left: '207px', top: '712px'}}><i className="ti ti-broadcast"></i><span>Sense</span></div>
  <div className="arch-flow-pill" style={{left: '440px', top: '712px'}}><i className="ti ti-git-merge"></i><span>Use</span></div>
  <div className="arch-flow-pill" style={{left: '1000px', top: '712px'}}><i className="ti ti-bolt"></i><span>Act</span></div>
  <div className="arch-flow-pill" style={{left: '1240px', top: '712px'}}><i className="ti ti-gavel"></i><span>Decision</span></div>
  <div className="arch-flow-pill" style={{left: '1438px', top: '712px'}}><i className="ti ti-send"></i><span>Dispatch</span></div>

  <div className="arch-fb-label" style={{left: '700px', top: '790px'}}><i className="ti ti-refresh"></i> continuous feedback loop — updated physical state re-enters sensing</div>

  {/* STAGE 1 : physical environment */}
  <div className="arch-box" id="s1">
    <div className="arch-box-title"><i className="ti ti-map-pin"></i>Physical environment</div>
    <div className="arch-grid">
      <div className="arch-cell"><i className="ti ti-users-group"></i><span>Crowd &amp; procession</span></div>
      <div className="arch-cell"><i className="ti ti-road"></i><span>Roads &amp; junctions</span></div>
      <div className="arch-cell"><i className="ti ti-door-enter"></i><span>Entry / exit gates</span></div>
      <div className="arch-cell"><i className="ti ti-video"></i><span>CCTV &amp; traffic cams</span></div>
      <div className="arch-cell"><i className="ti ti-shield-check"></i><span>Police &amp; barricades</span></div>
      <div className="arch-cell"><i className="ti ti-ambulance"></i><span>Ambulance &amp; cranes</span></div>
      <div className="arch-cell"><i className="ti ti-first-aid-kit"></i><span>Medical camps</span></div>
      <div className="arch-cell"><i className="ti ti-parking"></i><span>Parking areas</span></div>
    </div>
  </div>

  {/* STAGE 2 : data acquisition */}
  <div className="arch-box" id="s2">
    <div className="arch-box-title"><i className="ti ti-antenna-bars-5"></i>Real-time data acquisition</div>
    <div className="arch-row"><i className="ti ti-video"></i><div><b>Camera analytics</b><em>Density, movement, queue length, heatmaps</em></div></div>
    <div className="arch-row"><i className="ti ti-car"></i><div><b>Traffic analytics</b><em>Vehicle &amp; plate detection, flow, occupancy</em></div></div>
    <div className="arch-row"><i className="ti ti-id"></i><div><b>Registration platform</b><em>Digital pass, group size, immersion point</em></div></div>
    <div className="arch-row"><i className="ti ti-cpu"></i><div><b>IoT &amp; infrastructure</b><em>Crane, gate &amp; barricade status</em></div></div>
    <div className="arch-row"><i className="ti ti-map-2"></i><div><b>GIS &amp; external data</b><em>Road network, weather, history</em></div></div>
  </div>

  {/* DIGITAL TWIN CORE */}
  <div className="arch-core-region">
    <div className="arch-core-caption">Digital twin core</div>
    <div className="arch-core-frame"></div>
    <div className="arch-hub">Digital<br />twin<br />engine</div>

    <div className="arch-node" style={{left: '263px', top: '110px'}}>
        <div className="bub"><i className="ti ti-eye"></i><span className="arch-start-ring"></span><span className="arch-start-badge"><i className="ti ti-player-play"></i></span></div><b>Monitor</b><em>DT components display live state</em>
    </div>
    <div className="arch-node agentic" style={{left: '462px', top: '255px'}}>
      <div className="bub"><i className="ti ti-robot-face"></i></div><b>Analyze</b><em><b>Agentic AI</b> anomaly detection</em>
    </div>
    <div className="arch-node" style={{left: '387px', top: '490px'}}>
        <div className="bub"><i className="ti ti-chart-line"></i></div><b>Predict</b><em>Backend agents forecast crowd and traffic evolution</em>
    </div>
    <div className="arch-node" style={{left: '139px', top: '490px'}}>
        <div className="bub"><i className="ti ti-adjustments"></i></div><b>Simulate</b><em>Backend agents run what-if scenarios</em>
    </div>
    <div className="arch-node agentic" style={{left: '64px', top: '255px'}}>
        <div className="bub"><i className="ti ti-robot-face"></i></div><b>Decide</b><em>Backend agents prepare action recommendations</em>
    </div>
  </div>

    <div className="arch-box" id="s3" style={{left: '1096px', top: '182px', width: '296px', height: '170px'}}>
      <div className="arch-box-title"><i className="ti ti-message-report"></i>HybridAIAdvisor</div>
      <div className="arch-row"><i className="ti ti-sparkles"></i><div><b>Final summary / briefing</b><em>Converts agent outputs into the closing operational brief</em></div></div>
      <div className="arch-row"><i className="ti ti-plug-connected"></i><div><b>Fallback ready</b><em>Local summary if the remote model is unavailable</em></div></div>
    </div>

  {/* STAGE 4 : decision support */}
  <div className="arch-box" id="s4">
    <div className="arch-box-title"><i className="ti ti-git-branch"></i>Decision support scenarios</div>
    <div className="arch-row"><i className="ti ti-users" style={{color: 'var(--orange)'}}></i><div><b>Proactive crowd management</b><em>Stampede risk, hotspot alert, diversion</em></div></div>
    <div className="arch-row"><i className="ti ti-route" style={{color: 'var(--blue)'}}></i><div><b>Procession &amp; traffic control</b><em>ETA prediction, alternate route</em></div></div>
    <div className="arch-row"><i className="ti ti-list-numbers" style={{color: 'var(--green)'}}></i><div><b>Smart queue &amp; resources</b><em>Queue allocation, crane optimization</em></div></div>
    <div className="arch-row"><i className="ti ti-siren" style={{color: 'var(--red)'}}></i><div><b>Emergency response</b><em>Emergency corridor, medical dispatch</em></div></div>
  </div>

  {/* STAGE 5 : command center */}
  <div className="arch-box" id="s5">
    <div className="arch-box-title"><i className="ti ti-building-bank"></i>Authority command center</div>
    <div className="arch-grid">
      <div className="arch-cell"><i className="ti ti-shield-check"></i><span>Police dashboard</span></div>
      <div className="arch-cell"><i className="ti ti-traffic-cone"></i><span>Traffic control</span></div>
      <div className="arch-cell"><i className="ti ti-building-community"></i><span>Municipal corp.</span></div>
      <div className="arch-cell"><i className="ti ti-phone-call"></i><span>Emergency room</span></div>
    </div>
    <div className="arch-approve"><i className="ti ti-circle-check"></i>Approves &amp; releases action</div>
  </div>

  {/* STAGE 6 : real world adaptation */}
  <div className="arch-box" id="s6">
    <div className="arch-box-title" style={{padding: '9px 10px 6px'}}><i className="ti ti-bolt"></i>Field action</div>
    <div className="arch-item"><i className="ti ti-route-2"></i><span>Traffic diversion &amp; signage</span></div>
    <div className="arch-item"><i className="ti ti-door"></i><span>Gate &amp; queue control</span></div>
    <div className="arch-item"><i className="ti ti-crane"></i><span>Crane &amp; barricade ops</span></div>
    <div className="arch-item"><i className="ti ti-ambulance"></i><span>Emergency dispatch</span></div>
  </div>


      </div>
    </div>
  );
}
