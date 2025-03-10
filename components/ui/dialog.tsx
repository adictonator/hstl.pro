'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ShoppingCart, Terminal } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import { useDialog } from '@/hooks/use-dialog'

type PreviewModalProps = {
	isOpen: boolean
	onClose: () => void
	content: any
	children?: React.ReactNode
}

export function Dialog({
	isOpen,
	onClose,
	content,
	children,
}: PreviewModalProps) {
	const dialogRef = useRef<HTMLDivElement>(null)
	const closeButtonRef = useRef<HTMLButtonElement>(null)

	// Always call useDialog - prevent Rules of Hooks violation
	useDialog({
		dialogRef,
		initialFocusRef: closeButtonRef,
		onClose,
		isEnabled: isOpen, // Pass isOpen as a prop instead
	})

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					ref={dialogRef}
					role="dialog"
					aria-modal="true"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-6">
					<motion.div
						initial={{ scale: 0.98, y: 10 }}
						animate={{ scale: 1, y: 0 }}
						exit={{ scale: 0.98, y: 10 }}
						transition={{
							type: 'spring',
							stiffness: 200,
							damping: 25,
						}}
						className="border-border bg-background relative w-full overflow-hidden border border-dashed md:max-w-3xl">
						{/* Modal Header */}
						<div className="border-border flex items-center justify-between border-b border-dashed px-4 py-3">
							<div className="flex items-center gap-1.5 md:gap-3">
								<Terminal className="h-4 w-4 text-emerald-500" />
								<span className="text-xs text-neutral-400 md:text-sm">
									preview/
									{content.category.toLowerCase()}
								</span>
							</div>
							<button
								ref={closeButtonRef}
								onClick={onClose}
								className="text-xxs text-neutral-500 hover:text-neutral-300 md:text-xs">
								ESC to close
							</button>
						</div>

						{/* Preview Content */}
						{content.image && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="relative mx-auto md:size-96">
								{/* Preview Image */}
								<Image
									src={content.image}
									alt={content.title}
									className="size-full p-4"
									fill
								/>
							</motion.div>
						)}

						{children}

						{/* Preview Footer */}
						<footer className="border-t border-dashed border-neutral-800 p-4">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-base text-neutral-200 md:text-lg">
										{content.name}
									</h3>
									<p className="mt-1 text-xs text-neutral-400 md:text-sm">
										{content.description}
									</p>
									{content.list && (
										<ul className="text-muted-foreground mt-5 space-y-1 text-sm">
											{content.list.map(
												(item: string) => (
													<li key={item} className="">
														<ChevronRight
															className="mr-2.5 inline-block size-3 text-neutral-300"
															strokeWidth={1}
														/>
														{item}
													</li>
												),
											)}
										</ul>
									)}
								</div>
								<div className="flex gap-4">
									{'affiliateLink' in content && (
										<a
											href={content.affiliateLink}
											className="text-primary/80 hover:text-primary flex items-center gap-2 text-sm">
											<ShoppingCart
												className="size-4"
												strokeWidth={1.5}
											/>
											Buy
										</a>
									)}
								</div>
							</div>

							{content.extra && content.extra}
						</footer>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
