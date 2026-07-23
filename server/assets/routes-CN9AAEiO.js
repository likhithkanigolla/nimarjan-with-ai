import { n as useApp, r as useCanApprove, t as AppProvider } from "./store-ePhKtZ5e.js";
import { Suspense, lazy, useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { Activity, Ambulance, Boxes, CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, Cpu, EyeOff, FileBadge, Gauge, ImageIcon, Layers, Lightbulb, Pause, Play, PlayCircle, QrCode, Radar, Radio, RotateCcw, Route, ScrollText, ShieldAlert, ShieldCheck, Sparkles, UserCog, Users, Users2, Zap } from "lucide-react";
//#region src/components/RoleSelector.tsx
var roles = [
	"Command Center",
	"Traffic Police",
	"Field Officer",
	"Emergency Services",
	"Viewer"
];
function RoleSelector() {
	const { role, dispatch } = useApp();
	return /* @__PURE__ */ jsxs("label", {
		className: "chip cursor-pointer",
		children: [
			/* @__PURE__ */ jsx(UserCog, { className: "w-3 h-3 text-[var(--color-predict)]" }),
			"Role",
			/* @__PURE__ */ jsx("select", {
				value: role,
				onChange: (e) => dispatch({
					type: "SET_ROLE",
					role: e.target.value
				}),
				className: "bg-transparent outline-none ml-1 font-semibold uppercase text-[10px] tracking-wider",
				children: roles.map((r) => /* @__PURE__ */ jsx("option", {
					value: r,
					className: "bg-[var(--card)]",
					children: r
				}, r))
			})
		]
	});
}
//#endregion
//#region src/components/Header.tsx
function Header() {
	const { simTime, dispatch } = useApp();
	return /* @__PURE__ */ jsxs("header", {
		className: "glass flex h-14 items-center justify-between px-4 border-b border-[var(--panel-border)] relative z-30",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ jsx(motion.div, {
				initial: {
					scale: .9,
					opacity: 0
				},
				animate: {
					scale: 1,
					opacity: 1
				},
				className: "grid place-items-center w-9 h-9 rounded-md bg-gradient-to-br from-[var(--color-info)] to-[var(--color-predict)] shadow-lg shadow-black/40",
				children: /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5 text-white" })
			}), /* @__PURE__ */ jsxs("div", {
				className: "leading-tight",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-sm font-semibold tracking-wide",
					children: "Digital Twin for Crowd & Event Management"
				}), /* @__PURE__ */ jsx("div", {
					className: "text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
					children: "Ganesh Nimarjan Operations · Hyderabad"
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ jsxs("span", {
					className: "chip",
					children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[var(--color-warn)]" }), "Demo Environment — Simulated Data"]
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "chip",
					children: [
						/* @__PURE__ */ jsx(Radio, { className: "w-3 h-3 text-[var(--color-safe)]" }),
						"Sim Time ",
						/* @__PURE__ */ jsx("span", {
							className: "font-mono",
							children: simTime
						})
					]
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "chip",
					children: [
						/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3 h-3 text-[var(--color-info)]" }),
						"Digital Twin: ",
						/* @__PURE__ */ jsx("span", {
							className: "text-[var(--color-safe)] font-semibold ml-1",
							children: "SYNCHRONIZED"
						}),
						/* @__PURE__ */ jsx(motion.span, {
							className: "ml-1 w-1.5 h-1.5 rounded-full bg-[var(--color-safe)]",
							animate: { opacity: [
								.3,
								1,
								.3
							] },
							transition: {
								duration: 1.6,
								repeat: Infinity
							}
						})
					]
				}),
				/* @__PURE__ */ jsx(RoleSelector, {})
			]
		})]
	});
}
//#endregion
//#region src/components/SidebarNavigation.tsx
var nav = [
	{
		key: "team",
		label: "Team",
		icon: Users
	},
	{
		key: "introduction",
		label: "Introduction",
		icon: PlayCircle
	},
	{
		key: "scenario1",
		label: "Scenario 1",
		icon: Radar,
		hint: "Crowd risk + Emergency"
	},
	{
		key: "scenario2",
		label: "Scenario 2",
		icon: Route,
		hint: "Procession & Traffic"
	},
	{
		key: "scenario3",
		label: "Scenario 3",
		icon: Boxes,
		hint: "Immersion & Resources"
	},
	{
		key: "future",
		label: "Future Work",
		icon: Lightbulb
	},
	{
		key: "closing",
		label: "Architecture / Closing",
		icon: Layers
	}
];
function SidebarNavigation() {
	const { view, goToView } = useApp();
	return /* @__PURE__ */ jsxs("aside", {
		className: "glass w-[240px] shrink-0 border-r border-[var(--panel-border)] flex flex-col",
		children: [/* @__PURE__ */ jsx("nav", {
			className: "p-2 flex-1 space-y-1",
			children: nav.map(({ key, label, icon: Icon, hint }) => {
				const active = view === key;
				return /* @__PURE__ */ jsxs("button", {
					onClick: () => goToView(key),
					className: `w-full text-left group relative flex items-start gap-3 px-3 py-2.5 rounded-md transition-colors
                ${active ? "bg-[var(--accent)] text-foreground" : "hover:bg-[var(--secondary)] text-muted-foreground hover:text-foreground"}`,
					children: [
						active && /* @__PURE__ */ jsx(motion.span, {
							layoutId: "nav-indicator",
							className: "absolute left-0 top-1 bottom-1 w-1 rounded-r bg-[var(--color-info)]"
						}),
						/* @__PURE__ */ jsx(Icon, { className: `w-4 h-4 mt-0.5 ${active ? "text-[var(--color-info)]" : ""}` }),
						/* @__PURE__ */ jsxs("span", {
							className: "flex-1",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-sm font-medium leading-tight",
								children: label
							}), hint && /* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: hint
							})]
						})
					]
				}, key);
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "p-3 border-t border-[var(--panel-border)] text-[10px] text-muted-foreground uppercase tracking-wider",
			children: "v0.1 · Prototype"
		})]
	});
}
//#endregion
//#region src/components/SlideViewer.tsx
function SlideViewer({ title, subtitle, imageSrc, bullets }) {
	return /* @__PURE__ */ jsx("div", {
		className: "flex-1 relative overflow-hidden",
		children: /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				scale: .985
			},
			animate: {
				opacity: 1,
				scale: 1
			},
			transition: { duration: .35 },
			className: "h-full w-full grid grid-rows-[auto_1fr] p-6 gap-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("div", {
					className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground",
					children: "Presentation Slide"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-semibold mt-1",
					children: title
				}),
				subtitle && /* @__PURE__ */ jsx("p", {
					className: "text-muted-foreground mt-1 max-w-3xl",
					children: subtitle
				})
			] }), /* @__PURE__ */ jsxs("div", {
				className: "glass rounded-xl grid grid-cols-[1.4fr_1fr] gap-6 p-6 overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative rounded-lg border border-[var(--panel-border)] bg-black/30 overflow-hidden grid place-items-center",
					children: [imageSrc ? /* @__PURE__ */ jsx("img", {
						src: imageSrc,
						alt: title,
						className: "w-full h-full object-contain",
						onError: (e) => e.currentTarget.style.display = "none"
					}) : null, /* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 grid place-items-center text-muted-foreground pointer-events-none",
						children: /* @__PURE__ */ jsxs("div", {
							className: "text-center opacity-60",
							children: [
								/* @__PURE__ */ jsx(ImageIcon, { className: "w-10 h-10 mx-auto" }),
								/* @__PURE__ */ jsx("div", {
									className: "mt-2 text-sm",
									children: "Replace with presentation image"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-[11px] font-mono mt-1",
									children: [
										"/public/slides/",
										title.toLowerCase().replace(/\W+/g, "-"),
										".jpg"
									]
								})
							]
						})
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-4",
					children: bullets?.map((b, i) => /* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							x: 12
						},
						animate: {
							opacity: 1,
							x: 0
						},
						transition: { delay: .1 + i * .08 },
						className: "flex gap-3 items-start",
						children: [/* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full mt-2 bg-[var(--color-info)] shadow-[0_0_10px_var(--color-info)]" }), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-foreground/90 leading-relaxed",
							children: b
						})]
					}, i))
				})]
			})]
		}, title)
	});
}
//#endregion
//#region src/components/ScenarioControls.tsx
function ScenarioControls() {
	const { dispatch, currentScenario, currentStep, stepIndex, autoPlay } = useApp();
	if (!currentScenario || !currentStep) return null;
	const total = currentScenario.steps.length;
	return /* @__PURE__ */ jsxs("div", {
		className: "glass rounded-lg px-3 py-2 flex items-center gap-3",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ jsx("button", {
						onClick: () => dispatch({ type: "RESET" }),
						className: "p-2 rounded hover:bg-[var(--secondary)]",
						title: "Reset",
						children: /* @__PURE__ */ jsx(RotateCcw, { className: "w-4 h-4" })
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => dispatch({ type: "PREV" }),
						disabled: stepIndex === 0,
						className: "p-2 rounded hover:bg-[var(--secondary)] disabled:opacity-40",
						title: "Previous",
						children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => dispatch({
							type: "SET_AUTOPLAY",
							value: !autoPlay
						}),
						className: `p-2 rounded hover:bg-[var(--secondary)] ${autoPlay ? "text-[var(--color-info)]" : ""}`,
						title: autoPlay ? "Pause auto-play" : "Auto-play",
						children: autoPlay ? /* @__PURE__ */ jsx(Pause, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Play, { className: "w-4 h-4" })
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => dispatch({ type: "NEXT" }),
						disabled: stepIndex >= total - 1,
						className: "p-2 rounded hover:bg-[var(--secondary)] disabled:opacity-40",
						title: "Next",
						children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
					})
				]
			}),
			/* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-[var(--panel-border)]" }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 min-w-0",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "chip",
					children: [
						/* @__PURE__ */ jsx(Zap, { className: "w-3 h-3 text-[var(--color-warn)]" }),
						" Step ",
						stepIndex + 1,
						" / ",
						total
					]
				}), /* @__PURE__ */ jsx("span", {
					className: "text-sm font-medium truncate",
					children: currentStep.title
				})]
			})
		]
	});
}
//#endregion
//#region src/components/DigitalTwinDecisionPanel.tsx
var toneColor$1 = (t) => t === "safe" ? "text-[var(--color-safe)]" : t === "warn" ? "text-[var(--color-warn)]" : t === "risk" ? "text-[var(--color-risk)]" : t === "critical" ? "text-[var(--color-critical)]" : t === "info" ? "text-[var(--color-info)]" : "text-foreground";
function Section({ icon: Icon, title, children, tone }) {
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: { opacity: 0 },
		className: "glass rounded-lg p-3",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 mb-2",
			children: [/* @__PURE__ */ jsx(Icon, { className: `w-4 h-4 ${toneColor$1(tone)}` }), /* @__PURE__ */ jsx("div", {
				className: "text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
				children: title
			})]
		}), children]
	});
}
function DigitalTwinDecisionPanel() {
	const { currentStep, approvals, approve } = useApp();
	const canApprove = useCanApprove();
	if (!currentStep) return null;
	const p = currentStep.panel;
	return /* @__PURE__ */ jsx("div", {
		className: "w-[360px] shrink-0 flex flex-col gap-3 overflow-y-auto scrollbar-thin pr-1",
		children: /* @__PURE__ */ jsxs(AnimatePresence, {
			mode: "popLayout",
			children: [
				p?.current && /* @__PURE__ */ jsxs(Section, {
					icon: Gauge,
					title: "Current State",
					tone: "info",
					children: [/* @__PURE__ */ jsx("div", {
						className: "font-medium text-sm mb-2",
						children: p.current.title
					}), /* @__PURE__ */ jsx("ul", {
						className: "space-y-1.5",
						children: p.current.items.map((it, i) => /* @__PURE__ */ jsxs("li", {
							className: "flex justify-between text-xs",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground",
								children: it.label
							}), /* @__PURE__ */ jsx("span", {
								className: `font-mono ${toneColor$1(it.tone)}`,
								children: it.value
							})]
						}, i))
					})]
				}, "cur"),
				p?.prediction && /* @__PURE__ */ jsxs(Section, {
					icon: Sparkles,
					title: `Prediction · +${p.prediction.horizonMin} min`,
					tone: "critical",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "font-medium text-sm mb-1",
							children: p.prediction.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground mb-2",
							children: p.prediction.body
						}),
						p.prediction.items && /* @__PURE__ */ jsx("ul", {
							className: "space-y-1.5",
							children: p.prediction.items.map((it, i) => /* @__PURE__ */ jsxs("li", {
								className: "flex justify-between text-xs",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: it.label
								}), /* @__PURE__ */ jsx("span", {
									className: `font-mono ${toneColor$1(it.tone)}`,
									children: it.value
								})]
							}, i))
						}),
						p.prediction.risk && /* @__PURE__ */ jsxs("div", {
							className: "mt-2 chip",
							style: {
								color: "var(--color-critical)",
								borderColor: "var(--color-critical)"
							},
							children: ["Risk: ", p.prediction.risk]
						})
					]
				}, "pred"),
				p?.simulation && /* @__PURE__ */ jsxs(Section, {
					icon: Cpu,
					title: "Simulation",
					tone: "info",
					children: [/* @__PURE__ */ jsx("div", {
						className: "font-medium text-sm mb-2",
						children: p.simulation.title
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-1.5",
						children: p.simulation.options.map((o) => /* @__PURE__ */ jsxs("div", {
							className: `rounded-md border px-2.5 py-2 ${o.recommended ? "border-[var(--color-safe)]/60 bg-[var(--color-safe)]/8" : "border-[var(--panel-border)]"}`,
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-xs font-semibold",
									children: o.label
								}), o.recommended && /* @__PURE__ */ jsx("span", {
									className: "chip",
									style: {
										color: "var(--color-safe)",
										borderColor: "var(--color-safe)"
									},
									children: "Recommended"
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "text-[11px] text-muted-foreground mt-1",
								children: o.detail
							})]
						}, o.id))
					})]
				}, "sim"),
				p?.recommendation && /* @__PURE__ */ jsxs(Section, {
					icon: ShieldAlert,
					title: "Recommendation",
					tone: "warn",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "font-medium text-sm mb-2",
							children: p.recommendation.title
						}),
						p.recommendation.actions.length > 0 && /* @__PURE__ */ jsx("ul", {
							className: "space-y-1 mb-2",
							children: p.recommendation.actions.map((a, i) => /* @__PURE__ */ jsxs("li", {
								className: "text-xs flex gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[var(--color-warn)]",
									children: "◆"
								}), /* @__PURE__ */ jsx("span", { children: a })]
							}, i))
						}),
						p.recommendation.awaitingApproval && currentStep.approvalId && !approvals[currentStep.approvalId] && /* @__PURE__ */ jsxs("div", {
							className: "mt-2",
							children: [/* @__PURE__ */ jsx("div", {
								className: "chip mb-2",
								style: {
									color: "var(--color-warn)",
									borderColor: "var(--color-warn)"
								},
								children: "Awaiting Human Approval"
							}), /* @__PURE__ */ jsxs("button", {
								onClick: () => approve(currentStep.approvalId),
								disabled: !canApprove,
								className: "w-full inline-flex items-center justify-center gap-2 py-2 rounded-md\n                    bg-[var(--color-info)] text-[var(--primary-foreground)]\n                    hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium",
								title: canApprove ? "Approve" : "Your role cannot approve this action",
								children: [/* @__PURE__ */ jsx(ClipboardCheck, { className: "w-4 h-4" }), canApprove ? `Approve ${currentStep.approvalId}` : `${currentStep.approvalId} — role cannot approve`]
							})]
						}),
						p.recommendation.approvedText && /* @__PURE__ */ jsxs("div", {
							className: "mt-2 flex items-center gap-2 text-xs text-[var(--color-safe)]",
							children: [
								/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4" }),
								" ",
								p.recommendation.approvedText
							]
						})
					]
				}, "rec"),
				p?.impact && /* @__PURE__ */ jsxs(Section, {
					icon: Sparkles,
					title: "Expected Impact",
					tone: "safe",
					children: [/* @__PURE__ */ jsx("div", {
						className: "font-medium text-sm mb-2",
						children: p.impact.title
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "rounded-md border border-[var(--panel-border)] p-2",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-1",
								children: "Before"
							}), p.impact.before.map((it, i) => /* @__PURE__ */ jsxs("div", {
								className: "text-xs flex justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: it.label
								}), /* @__PURE__ */ jsx("span", {
									className: "font-mono",
									children: it.value
								})]
							}, i))]
						}), /* @__PURE__ */ jsxs("div", {
							className: "rounded-md border border-[var(--color-safe)]/40 bg-[var(--color-safe)]/8 p-2",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase tracking-wider text-[var(--color-safe)] mb-1",
								children: "After"
							}), p.impact.after.map((it, i) => /* @__PURE__ */ jsxs("div", {
								className: "text-xs flex justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: it.label
								}), /* @__PURE__ */ jsx("span", {
									className: "font-mono text-[var(--color-safe)]",
									children: it.value
								})]
							}, i))]
						})]
					})]
				}, "imp")
			]
		})
	});
}
//#endregion
//#region src/components/KPIGrid.tsx
var toneColor = (t) => t === "safe" ? "text-[var(--color-safe)]" : t === "warn" ? "text-[var(--color-warn)]" : t === "risk" ? "text-[var(--color-risk)]" : t === "critical" ? "text-[var(--color-critical)]" : t === "info" ? "text-[var(--color-info)]" : "text-foreground";
function KPIGrid() {
	const { currentStep } = useApp();
	if (!currentStep?.kpis?.length) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "glass rounded-lg p-2 flex gap-2 overflow-x-auto scrollbar-thin",
		children: currentStep.kpis.map((k, i) => /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				y: 6
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: { delay: i * .04 },
			className: "min-w-[130px] rounded-md border border-[var(--panel-border)] px-2.5 py-1.5",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-[10px] uppercase tracking-wider text-muted-foreground",
				children: k.label
			}), /* @__PURE__ */ jsx("div", {
				className: `text-sm font-semibold font-mono ${toneColor(k.tone)}`,
				children: k.value
			})]
		}, `${k.label}-${i}`))
	});
}
//#endregion
//#region src/components/PresenterCue.tsx
function PresenterCue() {
	return null;
}
//#endregion
//#region src/components/AuditLog.tsx
function AuditLog() {
	const { audit } = useApp();
	return /* @__PURE__ */ jsxs("div", {
		className: "glass rounded-lg p-2 h-full flex flex-col overflow-hidden",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 mb-2 px-1",
			children: [/* @__PURE__ */ jsx(ScrollText, { className: "w-4 h-4 text-[var(--color-info)]" }), /* @__PURE__ */ jsx("div", {
				className: "text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
				children: "Activity / Audit"
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "flex-1 overflow-y-auto scrollbar-thin space-y-1 pr-1",
			children: audit.map((e) => /* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					x: -8
				},
				animate: {
					opacity: 1,
					x: 0
				},
				className: "text-[11px] leading-snug flex gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "font-mono text-muted-foreground",
					children: e.time
				}), /* @__PURE__ */ jsx("span", { children: e.text })]
			}, e.id))
		})]
	});
}
//#endregion
//#region src/components/DigitalPass.tsx
function DigitalPass() {
	const { currentScenario, currentStep } = useApp();
	if (currentScenario?.id !== "scenario3") return null;
	const step = currentStep?.id ?? 1;
	const allocated = step >= 3;
	const failed = step >= 4 && step < 6;
	const reallocated = step >= 6;
	const ip = reallocated ? "IP-05" : allocated ? "IP-02" : "—";
	const crane = reallocated ? "CR-12" : allocated ? "CR-07" : "—";
	const slot = reallocated ? "21:43" : allocated ? "21:35" : "21:00–22:00";
	const route = reallocated ? "R7" : allocated ? "R6" : "—";
	const status = reallocated ? "REALLOCATED" : failed ? "RESOURCE FAULT" : allocated ? "ALLOCATED" : "REGISTERED";
	const statusColor = reallocated ? "var(--color-safe)" : failed ? "var(--color-critical)" : allocated ? "var(--color-info)" : "var(--color-warn)";
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: "glass rounded-xl p-4 relative overflow-hidden border-2",
		style: { borderColor: statusColor },
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30",
				style: { background: `radial-gradient(closest-side, ${statusColor}, transparent)` }
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-3 relative",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("div", {
						className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
						children: "Digital Immersion Pass"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "text-lg font-semibold font-mono mt-0.5",
						children: "GNI-2026-0142"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "text-xs text-muted-foreground",
						children: "Sri Vinayaka Youth Association · PDL-007"
					})
				] }), /* @__PURE__ */ jsx("div", {
					className: "grid place-items-center w-14 h-14 rounded-md border border-[var(--panel-border)] bg-black/30",
					children: /* @__PURE__ */ jsx(QrCode, { className: "w-8 h-8 opacity-80" })
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 text-xs relative",
				children: [
					/* @__PURE__ */ jsx(Row, {
						k: "Idol",
						v: "16 ft · 2,200 kg · 9 ft · Eco-Friendly"
					}),
					/* @__PURE__ */ jsx(Row, {
						k: "Pax",
						v: "650"
					}),
					/* @__PURE__ */ jsx(Row, {
						k: "Vehicles",
						v: "2 (TS09 •••• 4821)"
					}),
					/* @__PURE__ */ jsx(Row, {
						k: "Window",
						v: "21:00–22:00"
					}),
					/* @__PURE__ */ jsx(Row, {
						k: "Assigned IP",
						v: ip,
						tone: reallocated ? "safe" : "info"
					}),
					/* @__PURE__ */ jsx(Row, {
						k: "Crane",
						v: crane,
						tone: reallocated ? "safe" : failed ? "critical" : "info"
					}),
					/* @__PURE__ */ jsx(Row, {
						k: "Arrival slot",
						v: slot
					}),
					/* @__PURE__ */ jsx(Row, {
						k: "Route",
						v: route
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-3 flex items-center justify-between relative",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "chip",
					style: {
						color: statusColor,
						borderColor: statusColor
					},
					children: [
						/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3 h-3" }),
						" ",
						status
					]
				}), /* @__PURE__ */ jsx("span", {
					className: "text-[10px] text-muted-foreground",
					children: "Pass adapts to live Digital Twin state"
				})]
			})
		]
	}, status);
}
function Row({ k, v, tone }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground",
		children: k
	}), /* @__PURE__ */ jsx("div", {
		className: "text-right font-mono",
		style: { color: tone === "safe" ? "var(--color-safe)" : tone === "info" ? "var(--color-info)" : tone === "warn" ? "var(--color-warn)" : tone === "critical" ? "var(--color-critical)" : "inherit" },
		children: v
	})] });
}
//#endregion
//#region src/components/ClosingOverview.tsx
function ClosingOverview() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex-1 overflow-auto p-6 scrollbar-thin",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-5xl mx-auto space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("div", {
						className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground",
						children: "Architecture · Closing"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-semibold mt-1",
						children: "One Synchronized Digital Twin"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-muted-foreground max-w-3xl mt-1",
						children: "Crowd, traffic & processions, immersion resources, and emergency response are inseparable. Managing them in isolation is why crises escalate. The Digital Twin unifies them."
					})
				] }),
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
					children: [
						{
							icon: Users2,
							title: "Crowd",
							color: "var(--color-safe)",
							text: "Density · flow · dwell"
						},
						{
							icon: Boxes,
							title: "Traffic & Processions",
							color: "var(--color-info)",
							text: "Routes · vehicles · ETA"
						},
						{
							icon: ShieldAlert,
							title: "Immersion Resources",
							color: "var(--color-predict)",
							text: "Queues · cranes · slots"
						},
						{
							icon: Ambulance,
							title: "Emergency Response",
							color: "var(--color-critical)",
							text: "Corridors · units · ETA"
						}
					].map((c, i) => /* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { delay: i * .06 },
						className: "glass rounded-xl p-4 border-l-4",
						style: { borderLeftColor: c.color },
						children: [
							/* @__PURE__ */ jsx(c.icon, {
								className: "w-5 h-5",
								style: { color: c.color }
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-2 text-sm font-semibold",
								children: c.title
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-xs text-muted-foreground",
								children: c.text
							})
						]
					}, c.title))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "glass rounded-xl p-5 space-y-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
						children: "Cascades"
					}), [
						"A traffic problem can become a crowd problem.",
						"A resource failure can become a queue problem.",
						"A queue can become a traffic problem.",
						"A blocked route can become an emergency-response problem."
					].map((t, i) => /* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							x: -8
						},
						animate: {
							opacity: 1,
							x: 0
						},
						transition: { delay: .2 + i * .08 },
						className: "flex items-center gap-2 text-sm",
						children: [
							/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[var(--color-info)]" }),
							" ",
							t
						]
					}, i))]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "glass rounded-xl p-6 text-center",
					children: /* @__PURE__ */ jsxs("div", {
						className: "text-lg md:text-xl leading-relaxed",
						children: [
							/* @__PURE__ */ jsx("div", { children: "One synchronized Digital Twin." }),
							/* @__PURE__ */ jsx("div", { children: "One shared operational picture." }),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 text-[var(--color-info)] font-semibold",
								children: "From reactive management to proactive decision support."
							})
						]
					})
				})
			]
		})
	});
}
//#endregion
//#region src/components/ClientOnly.tsx
function ClientOnly({ children, fallback = null }) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	return /* @__PURE__ */ jsx(Fragment, { children: mounted ? children : fallback });
}
//#endregion
//#region src/components/AppShell.tsx
var DigitalTwinMap = lazy(() => import("./DigitalTwinMap-DWfSwaG5.js"));
function ScenarioWorkspace() {
	const { currentScenario, role } = useApp();
	const [showPass, setShowPass] = useState(false);
	if (!currentScenario) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex-1 flex flex-col gap-3 min-h-0",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
						children: currentScenario.name
					}), /* @__PURE__ */ jsx("div", {
						className: "text-sm font-medium truncate",
						children: currentScenario.headline
					})]
				}), /* @__PURE__ */ jsx(ScenarioControls, {})]
			}),
			/* @__PURE__ */ jsx(KPIGrid, {}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 min-h-0 flex gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-1 min-w-0 flex flex-col gap-3",
					children: [/* @__PURE__ */ jsx(ClientOnly, {
						fallback: /* @__PURE__ */ jsx("div", {
							className: "flex-1 rounded-lg border border-[var(--panel-border)] grid place-items-center text-muted-foreground",
							children: "Loading map…"
						}),
						children: /* @__PURE__ */ jsx(Suspense, {
							fallback: /* @__PURE__ */ jsx("div", {
								className: "flex-1 rounded-lg border border-[var(--panel-border)] grid place-items-center text-muted-foreground",
								children: "Loading map…"
							}),
							children: /* @__PURE__ */ jsx(DigitalTwinMap, {})
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-end justify-between gap-3 absolute bottom-4 left-4 z-[400] right-4 pointer-events-none",
						children: [/* @__PURE__ */ jsx("div", {
							className: "pointer-events-auto",
							children: /* @__PURE__ */ jsx(PresenterCue, {})
						}), currentScenario.id === "scenario3" && /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-end gap-2 pointer-events-auto",
							children: [/* @__PURE__ */ jsxs("button", {
								onClick: () => setShowPass(!showPass),
								className: "bg-[var(--card)] border border-[var(--panel-border)] shadow-lg px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[var(--card-hover)] transition-colors",
								children: [/* @__PURE__ */ jsx(FileBadge, { className: "w-4 h-4 text-[var(--color-info)]" }), showPass ? "Hide Pass" : "View Digital Pass"]
							}), /* @__PURE__ */ jsx(AnimatePresence, { children: showPass && /* @__PURE__ */ jsx(motion.div, {
								initial: {
									opacity: 0,
									y: 10,
									scale: .95
								},
								animate: {
									opacity: 1,
									y: 0,
									scale: 1
								},
								exit: {
									opacity: 0,
									y: 10,
									scale: .95
								},
								className: "min-w-[340px] max-w-[380px]",
								children: /* @__PURE__ */ jsx(DigitalPass, {})
							}) })]
						})]
					})]
				}), role !== "Viewer" ? /* @__PURE__ */ jsxs("div", {
					className: "w-[360px] shrink-0 flex flex-col gap-3 min-h-0 relative z-[400]",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex-1 min-h-0 flex flex-col gap-3",
						children: /* @__PURE__ */ jsx(DigitalTwinDecisionPanel, {})
					}), /* @__PURE__ */ jsx("div", {
						className: "h-[160px] shrink-0",
						children: /* @__PURE__ */ jsx(AuditLog, {})
					})]
				}) : /* @__PURE__ */ jsx("div", {
					className: "w-[360px] shrink-0 flex flex-col gap-3 min-h-0 relative z-[400]",
					children: /* @__PURE__ */ jsxs("div", {
						className: "glass rounded-lg flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground border border-[var(--panel-border)]",
						children: [
							/* @__PURE__ */ jsx(EyeOff, { className: "w-10 h-10 mb-4 opacity-50" }),
							/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-semibold text-foreground mb-1",
								children: "Viewer Mode"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs",
								children: "Your current role has read-only access. Decision controls and logs are hidden."
							})
						]
					})
				})]
			})
		]
	});
}
function ViewSwitcher() {
	const { view } = useApp();
	return /* @__PURE__ */ jsx(AnimatePresence, {
		mode: "wait",
		children: /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				y: 6
			},
			animate: {
				opacity: 1,
				y: 0
			},
			exit: { opacity: 0 },
			transition: { duration: .25 },
			className: "flex-1 flex flex-col min-h-0",
			children: [
				view === "team" && /* @__PURE__ */ jsx(SlideViewer, {
					title: "Team",
					subtitle: "Ideathon Team · Digital Twin for Crowd & Event Management",
					imageSrc: "/slides/team-placeholder.jpg",
					bullets: [
						"Moderator + 4 team members",
						"Roles: Vision · Data · Simulation · Ops",
						"Replace this slide with the team photo"
					]
				}),
				view === "introduction" && /* @__PURE__ */ jsx(SlideViewer, {
					title: "Introduction",
					subtitle: "Why Ganesh Nimarjan operations need a Digital Twin",
					imageSrc: "/slides/introduction-placeholder.jpg",
					bullets: [
						"Hyderabad — hundreds of pandals, dozens of immersion points, millions on the streets",
						"Crowd, traffic, resources, and emergency response are handled by different agencies today",
						"Reactive management leads to cascading failures during peak windows",
						"This prototype demonstrates a Digital Twin that predicts, simulates, recommends — with human approval"
					]
				}),
				(view === "scenario1" || view === "scenario2" || view === "scenario3") && /* @__PURE__ */ jsx(ScenarioWorkspace, {}),
				view === "future" && /* @__PURE__ */ jsx(SlideViewer, {
					title: "Future Work",
					subtitle: "From prototype to production-grade Digital Twin",
					imageSrc: "/slides/future-work-placeholder.jpg",
					bullets: [
						"AI prediction agent (crowd density, arrival forecasting)",
						"Traffic optimization agent (system-wide, not greedy shortest path)",
						"Resource allocation agent (crane/queue/window optimization)",
						"Real-time WebSocket feeds from cameras, GPS, IoT",
						"Full audit trail with cryptographic signing",
						"Multi-agency access with fine-grained RBAC"
					]
				}),
				view === "closing" && /* @__PURE__ */ jsx(ClosingOverview, {})
			]
		}, view)
	});
}
function AppShell() {
	return /* @__PURE__ */ jsx(AppProvider, { children: /* @__PURE__ */ jsxs("div", {
		className: "h-screen w-screen flex flex-col overflow-hidden",
		children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsxs("div", {
			className: "flex-1 flex min-h-0",
			children: [/* @__PURE__ */ jsx(SidebarNavigation, {}), /* @__PURE__ */ jsx("main", {
				className: "flex-1 min-w-0 p-3 flex flex-col",
				children: /* @__PURE__ */ jsx(ViewSwitcher, {})
			})]
		})]
	}) });
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function Home() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(AppShell, {}), /* @__PURE__ */ jsx(Toaster, {
		position: "bottom-center",
		theme: "dark",
		richColors: true,
		closeButton: true
	})] });
}
//#endregion
export { Home as component };
