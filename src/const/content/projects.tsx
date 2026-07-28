import { NavElement, ProjectPageType } from "@/types/data";
import { Balloon, Megaphone, Newspaper, Satellite, SatelliteDish, Telescope, Users } from "lucide-react";

export const ProjectPages: { [K in any]: ProjectPageType } = {
    gs1: {
        project: {
            id: "GS-1",
            title: "Ground Station 1",
            url: "/posters/gs_1_poster.pdf",
            short: "An in-house UHF ground station for LEO satellite communication",
            description: "To communicate with our future satellites, WashU Satellite needed an in-house-built UHF ground station antenna. GS-1 consists of a 3.6 m circularly-polarized Yagi-Uda antenna, an azimuth and elevation rotator, an SDR (software defined radio), and a frame to hold it all. It is designed to operate in rooftop outdoor conditions indefinitely, including up to 90 mph winds, rain, and snow.",
            contributors: 47,
            date: "Q2-2025",
            icon: (<SatelliteDish size={22} />),
            phase: 'assembly',
            posterUrl: "/posters/gs_1_poster.pdf",
            image: "/projects/gs1.png"
        },
        tagline: "A UHF Ground Station for LEO Satellite Communication.",
        factSheet: [
            { label: "Status", value: "Tuned and assembled; pending end-to-end software and rotator-control testing" },
            { label: "Operating Frequency", value: "437.5 MHz (UHF)" },
            { label: "Antenna", value: "3.6 m circularly-polarized Yagi-Uda" },
            { label: "Design Gain", value: "16–17 dBiC" },
            { label: "Environmental", value: "Indefinite outdoor operation; up to 90 mph winds, rain, snow" },
            { label: "Site", value: "WashU campus rooftop" },
        ],
        sections: [
            {
                heading: "Introduction",
                body: "Building our own UHF link took longer than buying one off the shelf, but gave our technical teams the depth of experience needed for satellite-side communications, where a design error can end a mission. GS-1 is currently tuned and assembled, waiting on end-to-end software testing and rotator control debugging before being installed on a WashU rooftop.",
            },
        ],
        engineering: [
            {
                title: "Antenna",
                description: "A 3.6 m circularly-polarized Yagi-Uda with 18 elements per polarization axis and a target gain of 16–17 dBiC. It is hand-tuned to account for the dielectric mounting materials in the delicate near-field, and supported by a typical inline-component RF architecture including low-noise and power amplifiers and analog filters.",
            },
            {
                title: "Software Defined Radio",
                description: "GS-1 uses a HackRF One — easily reconfigurable and upgradable, with a wide frequency range (1 MHz – 6 GHz), low cost ($300), and GNU Radio compatibility. It interfaces with our gs-sdr software module over serial and connects to the front-end RF via SMA.",
            },
            {
                title: "Software & Comms Pipeline",
                description: "A custom packetization and communication pipeline built off industry-tested CCSDS standards. Telemetry and response packets are saved to persistent storage and visualized through Grafana + ReactJS dashboards, providing a rich environment for data visualization and command synthesis.",
            },
            {
                title: "Structure",
                description: "All-aluminum, PVC, and galvanized steel parts for weather resistance. The base supports up to 400 kg of cinderblock ballast to stay upright in high winds. The enclosure protects electronics from thermal shocks and water damage.",
            },
        ],
        modules: ["Mechanical", "Electrical", "Software", "Systems"],
        acknowledgments: "Supported by WashU Satellite, McKelvey Engineering, the ESE Department, and the MEMS Department. Special thanks to PI James Buckley, Andrew Clark, Marion Sudvarg, Louis Woodhams, and all our advisors and mentors.",
        overview: "",
        disciplineOverviews: []
    },
    airis: {
        project: {
            id: "AIRIS",
            title: "ADAPT Incidence Resolution & Imaging Subsystem",
            url: "/posters/airis_poster.pdf",
            short: "Optical follow-up telescope for gamma-ray bursts on NASA's ADAPT balloon",
            description: "AIRIS is a student-designed, student-built optical telescope flying on NASA's ADAPT high-altitude balloon over Antarctica. Its job is to capture the first seconds of visible light from gamma-ray bursts (GRBs) — the most powerful explosions in the universe — and refine ADAPT's degree-scale localizations down to sub-arcseconds for the global astronomy community.",
            contributors: 47,
            date: "Flight Dec 2026",
            icon: (<Telescope size={24} />),
            phase: 'assembly',
            posterUrl: "/posters/airis_poster.pdf",
            image: "/projects/airis.png",
            imagePosition: "left",
            imageSize: "60rem"
        },
        tagline: "A student-built optical telescope advancing the future of multi-messenger astrophysics.",
        factSheet: [
            { label: "Launch Date", value: "December 2026 (Antarctic long-duration flight)" },
            { label: "Platform", value: "NASA ADAPT high-altitude balloon (~140,000 ft)" },
            { label: "Affiliation", value: "WashU Satellite, Department of Physics, McKelvey School of Engineering" },
            { label: "Mission Partners", value: "NASA, Washington University in St. Louis, ADAPT" },
            { label: "Principal Investigator", value: "James Buckley, Ph.D." },
        ],
        sections: [
            {
                heading: "What is AIRIS?",
                body: "ADAPT detects gamma-ray bursts in gamma rays. As soon as it detects a burst, it sends a large region of the sky, containing the burst, to AIRIS. AIRIS slews up to 30°/s, scans the region, narrows down the location of the burst, and takes optical images of the early afterglow — using a 200 mm f/1.8 lens, a sensitive Sony CMOS sensor, and onboard GPU processing. AIRIS gives students firsthand experience designing a real astrophysics instrument, one that contributes to global multi-messenger astronomy through NASA's General Coordinates Network (GCN).",
            },
            {
                heading: "Why It Matters",
                body: "Gamma-ray bursts occur billions of light-years away and last for only seconds. Their interaction with the surrounding cosmic medium creates an afterglow that appears in the X-ray, visible, ultraviolet, and radio spectrum, and fades quickly. Capturing the visible light in the first 30 seconds is essential for understanding the geometry and energy of the jet that created the GRB, the progenitor system, and the evolution of the explosion. AIRIS bridges a critical gap by linking ADAPT's fast gamma-ray detection to rapid optical follow-up.",
            },
        ],
        objectives: [
            { title: "Rapid GRB Afterglow Imaging", description: "Capture the optical afterglow of a gamma-ray burst within 30 seconds of an ADAPT trigger." },
            { title: "Localization Refinement", description: "Improve ADAPT's position estimate from degrees to sub-arcseconds by comparing live images to onboard star maps." },
            { title: "Observe Additional Transients", description: "Monitor bright blazars, active galactic nuclei, and fast radio burst counterparts visible from the southern skies." },
            { title: "Prototype Search & Control Algorithms", description: "Serve as an in-flight testbed for next-generation transient search strategies, paving the way for the VECTOR CubeSat." },
        ],
        engineering: [
            {
                title: "Optical System",
                description: "Canon 200 mm f/1.8 lens with a custom 645–675 nm bandpass filter to cut through Antarctic-summer atmospheric glare. The low-noise Sony IMX455 CMOS sensor reaches magnitude 12 on minimum success and 14+ under optimal conditions.",
            },
            {
                title: "High-Performance Computing Pipeline",
                description: "An onboard NVIDIA Jetson GPU stacks short exposures, corrects motion blur, registers frames to a stored star map using HEALPix, and automatically flags transient sources. Confirmed bursts trigger a real-time alert to NASA's Global Coordinates Network.",
            },
            {
                title: "Precision Attitude Control",
                description: "Vacuum-rated stepper motors and encoders deliver ≤30°/s slews with <2 s settle time and ≤1″ pointing knowledge. Fine pointing is refined in real time using feedback from the imaging pipeline itself.",
            },
            {
                title: "Flight-Ready Mechanical & Thermal",
                description: "A 6061 aluminum frame keeps mass low; heat pipes conduct excess energy into the gondola structure to manage thermal extremes in the near-vacuum stratosphere — all within a 20 kg, 40 W envelope.",
            },
            {
                title: "Power",
                description: "AIRIS pulls from ADAPT's unregulated power bus through a buck converter, then splits into 22 V (Ximea Interface Board), 5 V (magnetometer), and 3.3 V (IMU) rails for a stable, predictable supply across the flight.",
            },
        ],
        specs: [
            { label: "Lens", value: "Canon 200 mm f/1.8" },
            { label: "Bandpass Filter", value: "645–675 nm" },
            { label: "Sensor", value: "Sony IMX455 mono CMOS" },
            { label: "Compute", value: "NVIDIA Jetson GPU" },
            { label: "Slew Rate", value: "≤30°/s, <2 s settle" },
            { label: "Pointing Knowledge", value: "≤1″" },
            { label: "Mass", value: "20 kg" },
            { label: "Power Budget", value: "40 W" },
            { label: "Latency Budget", value: "~25 s trigger → first stacked frame" },
            { label: "Target Magnitude", value: "12 (minimum), 14+ (optimal)" },
        ],
        modules: ["Structure", "Imaging", "Controls", "Power", "Comms"],
        schedule: [
            { label: "Oct 2025", value: "Thermal vacuum (TVAC) chamber test" },
            { label: "Jun 2026", value: "Integration onto ADAPT gondola" },
            { label: "Dec 2026", value: "Antarctic long-duration balloon flight" },
        ],
        acknowledgments: "Supported by the WashU Physics Department and the McKelvey School of Engineering. Special thanks to PI James Buckley, Andrew Clark, Marion Sudvarg, Richard Bose, and the rest of our advisors.",
        overview: "",
        disciplineOverviews: []
    },
    scalar: {
        project: {
            id: "SCALAR",
            title: "Secure Configurable Autonomous Laboratory for Algorithm Research",
            short: "1U CubeSat building WashU Satellite's orbital heritage",
            description: "SCALAR is our first orbital mission — a 1U CubeSat designed to build orbital heritage for WashU Satellite, demonstrating our ability to design, build, test, and operate a satellite end-to-end alongside our ground station. Its payload is our novel Mission Operations Framework, which turns the spacecraft into a reconfigurable orbital laboratory that experiments can be uploaded to and run on from the ground.",
            contributors: 47,
            date: "Early 2027",
            icon: (<Satellite size={22} />),
            phase: 'design'
        },
        tagline: "Our first satellite — building orbital heritage and flying our Mission Operations Framework.",
        factSheet: [
            { label: "Form Factor", value: "1U CubeSat" },
            { label: "Planned Launch", value: "Early 2027" },
            { label: "Heritage", value: "Open-source hardware and software (notably the PROVES Kit)" },
            { label: "Demonstration", value: "Mission Operations Framework on orbit" },
        ],
        sections: [
            {
                heading: "What is SCALAR?",
                body: "SCALAR's primary mission is to prove WashU Satellite can design, build, and operate a satellite while running our own mission and ground station — earning the orbital heritage every future mission depends on. Its payload is the first orbital deployment of our Mission Operations Framework, making the spacecraft a reconfigurable laboratory for algorithms uploaded after launch — the operational foundation our follow-on VECTOR mission depends on.",
            },
            {
                heading: "Mission Operations Framework",
                body: "Alongside the satellite itself, our software team is building a novel Mission Operations Framework — a software pipeline for uploading and controlling orbital experiments entirely from the ground. Building on technologies pioneered by the European Space Agency, the framework will let outside research groups and amateur teams operate their own experiments through an accessible interface on our flight hardware, at no cost.",
            },
        ],
        engineering: [
            {
                title: "Reconfigurable Payload",
                description: "Algorithms are uploaded and swapped across the mission rather than fixed at launch, letting a single 1U bus run many experiments over its lifetime.",
            },
            {
                title: "Open-Source Heritage",
                description: "Heavily leverages open-source CubeSat hardware and software — particularly the PROVES Kit — to keep an aggressive timeline realistic.",
            },
            {
                title: "Mission Operations Framework",
                description: "Ground-based pipeline for uploading and running experiments on flight hardware, designed to host external user payloads as well as our own.",
            },
        ],
        modules: ["Software", "Electrical", "Mechanical", "Mission Ops", "Systems"],
        schedule: [
            { label: "Early 2027", value: "Planned launch" },
        ],
        overview: "",
        disciplineOverviews: []
    },
    vector: {
        project: {
            id: "VECTOR",
            title: "An Analysis of Small Satellites as Contributors Towards High-Energy Astrophysics",
            url: "/posters/vector_poster.pdf",
            short: "CubeSat-scale optical telescope with onboard search algorithms for GRB afterglows",
            description: "Within a small satellite form factor, demonstrate an optical telescope with onboard processing to perform search algorithms. Larger optical telescopes are busy and ground observatories can be blocked by weather or location — small satellites could act as additional, cheaper detectors. VECTOR's mission is to determine whether that is feasible.",
            contributors: 47,
            date: "Launch ~2029",
            icon: (<Satellite size={22} />),
            phase: 'proposal',
            posterUrl: "/posters/vector_poster.pdf",
            image: "/projects/vector.png",
            imageSize: "60rem"
        },
        tagline: "Can a CubeSat catch a gamma-ray burst afterglow? VECTOR is built to find out.",
        factSheet: [
            { label: "Form Factor", value: "CubeSat (UNP Mission Concept design)" },
            { label: "Status", value: "Proposal — Mission Concept course complete; CSLI proposal pending" },
            { label: "Funding", value: "$50k Mission Concept grant — University Nanosatellite Program (Summer 2025)" },
            { label: "Authors", value: "Sophie Fendler, Jack Galloway, WashU Satellite Team — PI James Buckley, Ph.D." },
            { label: "Expected Launch", value: "2029" },
        ],
        sections: [
            {
                heading: "Gamma-Ray Bursts and Their Afterglows",
                body: "A gamma-ray burst (GRB) is a cosmic explosion caused by a dying star or a neutron-star collision, sending out powerful jets of energy. First there is a short flash of gamma rays (milliseconds to minutes). As the jet interacts with surrounding gas and dust, it glows in X-rays, visible light, and radio waves for days to weeks. This is the afterglow — appearing as a point source — and catching it provides information about the black hole that produced the burst.",
            },
            {
                heading: "Why Optical Telescopes Need Search Algorithms",
                body: "GRB detectors often produce wide localized regions where they think the burst occurred. An optical telescope, with a small field of view, has to search through that region to find the burst — and it is important to catch the optical part of these bursts as soon as possible, because early optical light-curve data leads to insights about the GRB source. Once VECTOR finds the afterglow, the localization can be sent to other instruments worldwide.",
            },
        ],
        objectives: [
            { title: "MO-1: Image Astronomical Objects on a CubeSat", description: "Capture astronomical images from a CubeSat-class platform." },
            { title: "MO-2: Detect a Transient Onboard", description: "Demonstrate the use of on-board processing to detect an artificial transient." },
            { title: "FSC-1: Limiting Magnitude ≥ 12", description: "VECTOR's limiting magnitude must be at least 12." },
            { title: "FSC-2: Find a Transient in a 30°×30° PDF Region", description: "Detect an artificial transient (±TBD positional error) through a 30°×30° (TBR) PDF-defined region within 30 minutes (TBR)." },
            { title: "FSC-3: Multiple Algorithms", description: "Complete the FSC-2 process with more than one search algorithm." },
        ],
        engineering: [
            {
                title: "Optical Payload",
                description: "Canon 200 mm f/2.8 lens paired with a Ximea MX042MR-GP-BSI-X4G2 sensor — a 4.1 MP monochrome CMOS with 91% QE and 1.2 e⁻ read noise — chosen to reach the limiting magnitude required to detect afterglows.",
            },
            {
                title: "Onboard Search Algorithms",
                description: "An artificial sky map is loaded with a star purposely removed; VECTOR then searches the corresponding region of the real sky to find the new bright object — exactly the workflow needed when a GRB detector hands off a wide localization region.",
            },
            {
                title: "Concept of Operations",
                description: "Five operating modes: SAFE (recovery from major faults), SHIELD (generate power while keeping the imager off the sun), STANDBY (nominal comms + power), PREPARE (get ready for an experiment), and EXPERIMENT (active slewing while running search algorithms).",
            },
        ],
        specs: [
            { label: "Lens", value: "Canon 200 mm f/2.8" },
            { label: "Sensor", value: "Ximea MX042MR-GP-BSI-X4G2" },
            { label: "Resolution", value: "4.1 MP monochrome CMOS" },
            { label: "Quantum Efficiency", value: "91%" },
            { label: "Read Noise", value: "1.2 e⁻" },
            { label: "Limiting Magnitude (target)", value: "≥ 12" },
        ],
        modules: ["Software", "Electrical", "Mechanical", "Physics", "Mission Ops", "Systems"],
        acknowledgments: "Produced through the University Nanosatellite Program (UNP) Mission Concept course. WashU Satellite was granted $50k to develop this mission over the summer with support from the Air Force Research Lab, Space Dynamics Laboratory, and NASA. Supported by the Physics Department and the McKelvey School of Engineering. Special thanks to PI James Buckley and all our advisors.",
        overview: "",
        disciplineOverviews: []
    },
    spinor: {
        project: {
            id: "SPINOR",
            title: "Exploring the sub-30 MHz Radio Sky in Fine Resolution",
            url: "/posters/spinor_poster.pdf",
            short: "Spin-stabilized resonant tether antennas for sub-30 MHz radio astronomy",
            description: "SPINOR is a program designed to image the sub-30 MHz radio sky in fine resolution for the first time, promising discoveries ranging across exoplanet magnetic interactions, heliophysics and space weather, and 21-cm cosmology. Its hardware consists of a set of spin-stabilized conductive tethers located outside of the ionosphere, acting as configurable, low-frequency resonant antennas, with possible data processing techniques including imaging, beamforming, and interferometry.",
            contributors: 47,
            date: "Phase I: Q4-2025",
            icon: (<Satellite size={22} />),
            phase: 'proposal',
            posterUrl: "/posters/spinor_poster.pdf"
        },
        tagline: "Opening the last unexplored window of the electromagnetic spectrum — radio waves below 30 MHz.",
        factSheet: [
            { label: "Status", value: "Proposal — aggressive de-risking campaign underway" },
            { label: "Target Frequencies", value: "Below 30 MHz" },
            { label: "Approach", value: "Spin-stabilized conductive-tether resonant antennas, beyond the ionosphere" },
            { label: "Authors", value: "Sophie Fendler (Physics), Ben Cook (EE)" },
        ],
        sections: [
            {
                heading: "Why sub-30 MHz?",
                body: "Observations within the 30 MHz frequency band are obstructed by ionospheric effects in Earth's atmosphere, preventing ground observations — all data collection has to occur in space, beyond the ionosphere. In the 1970s, the RAE-1 and RAE-2 missions deployed lunar-orbiting, 229 m travelling-wave V-shape antennas to conduct directional surveys across 22 frequencies between 0.25 and 9.18 MHz, at a spatial resolution of roughly 1 steradian. Advancing this work to high-resolution, high-sensitivity imaging opens up a plethora of scientific opportunities: direct observations of exoplanet magnetospheres and their interactions with solar magnetic fields, heliophysics and space-weather data collection, investigations into planetary magnetospheres and lightning strikes within our solar system, and research in 21-cm cosmology.",
            },
            {
                heading: "The GO-LoW Proposal",
                body: "GO-LoW is a proposal for a mega-constellation of 3U CubeSats equipped with electrically short vector sensors, giving initial directional and spectral information through interferometry to enable simultaneous full-sky fine spatial and spectral resolution mapping. A key drawback of their proposal is the constellation size — largely due to the low sensitivity of the electrically short antenna.",
            },
            {
                heading: "SPINOR's Architecture",
                body: "SPINOR uses resonant antennas, which offer much greater sensitivity per element, allowing a reduction in constellation size. At these wavelengths, very large deployable structures are required, so simple, spin-stabilized conductive-tether designs are preferable to reduce system risk and complexity. Tether geometries range from a two-mass system (a simple dipole) to a general case of N-vertex convex polyhedra. To address the narrow bandwidth, the tethers can be extended and retracted to sweep the mapping across frequency space. The major disadvantage is very limited directionality, especially for dipole setups — but rotation enables repeated sampling, which makes computational inverse imaging viable for high sensitivity and resolution.",
            },
            {
                heading: "Development Roadmap",
                body: "Several key technologies need de-risking — imaging techniques, rotating tether deployment, readout electronics, and satellite bus design. To address this, an aggressive test campaign is underway: senior design projects flying on high-altitude balloons in Q4 2025 and Q3 2026, sounding-rocket missions, a gravity-gradient deployment method on our SCALAR satellite in Q4 2025, and a 3U mission to HEO demonstrating full system functionality. These culminate in circumlunar and deep-space missions, eliminating the anthropic background and enabling highly sensitive cosmology missions.",
            },
        ],
        schedule: [
            { label: "Q4 2025", value: "Senior-design HAB flight + SCALAR gravity-gradient deployment test" },
            { label: "Q3 2026", value: "Second high-altitude balloon flight" },
            { label: "TBD", value: "Sounding-rocket missions" },
            { label: "TBD", value: "3U HEO mission — full system demonstration" },
            { label: "Future", value: "Circumlunar and deep-space cosmology missions" },
        ],
        modules: ["Physics", "Electrical", "Mechanical", "Software"],
        acknowledgments: "Supported by WashU Satellite, McKelvey Engineering, the ESE Department, and the Physics Department. Special thanks to James Buckley, Andrew Clark, Marion Sudvarg, and all our advisors and mentors.",
        overview: "",
        disciplineOverviews: []
    },
    sb1: {
        project: {
            id: "SB-1",
            title: "Small Balloon 1",
            short: "Our first flight: a small balloon payload with a camera",
            description: "Small Balloon 1 was our very first project. We launched a payload running hardware and software similar to what would later fly on our first satellite, with the dual goal of producing real science output and giving the team firsthand experience planning and operating a mission together.",
            contributors: 11,
            date: "Q2-2024",
            icon: (<Balloon size={28}/>),
            phase: 'success'
        },
        tagline: "Our first mission — proving we can plan, build, and fly together.",
        factSheet: [
            { label: "Status", value: "Flown successfully (Q2 2024)" },
            { label: "Vehicle", value: "4 ft helium balloon" },
            { label: "Compute", value: "Raspberry Pi" },
        ],
        sections: [
            {
                heading: "What we flew",
                body: "The payload consisted of a Raspberry Pi, a mounting plate, a camera, and two 2-axis gimbals. Lifted by a 4-foot helium balloon, the flight was successful — and produced great campus shots and, more importantly, the team's first end-to-end mission experience.",
            },
        ],
        overview: "",
        disciplineOverviews: []
    }
}

export const PublicationsNavigation: NavElement[] = [
    {
        id: "Scientific Publications",
        title: "Scientific Publications",
        url: "publications",
        icon: (<Newspaper size={24}/>),
        short: "Papers, articles, posters, and other publications from our team"
    },
    {
        id: "News",
        title: "News",
        url: "news",
        icon: (<Megaphone size={22}/>),
        short: "Announcements and other exciting tidbits"
    }
];

export const TeamNavigation: NavElement[] = [
    {
        id: "Members & Alumni",
        title: "Members & Alumni",
        url: "team",
        icon: (<Users size={24}/>),
        short: "The people who make it all possible"
    },
    // {
    //     id: "Team Structure",
    //     title: "Team Structure",
    //     url: "not-ready",
    //     icon: (<FaCircleNodes size={20}/>),
    //     short: "Group organization and its benefits"
    // }
]

export const ProjectHighlightData = Object.keys(ProjectPages).map(p => ProjectPages[p].project);
