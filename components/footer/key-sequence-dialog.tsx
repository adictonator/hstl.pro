import { sequenceCode } from '@/data/easter-eggs'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useToast } from '../ui/toast'
import { useDialog } from '@/hooks/use-dialog'

export default function KeySequenceDialog({
	onClose,
	unlockEasterEggs,
}: {
	onClose: () => void
	unlockEasterEggs: () => void
}) {
	const { showToast } = useToast()
	const [sequenceIndex, setSequenceIndex] = useState(0)
	const dialogRef = useRef<HTMLDivElement>(null)
	const cancelButtonRef = useRef<HTMLButtonElement>(null)

	// Use our custom dialog hook
	useDialog({
		dialogRef,
		initialFocusRef: cancelButtonRef,
		onClose,
	})

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === sequenceCode[sequenceIndex]) {
				const nextIndex = sequenceIndex + 1
				setSequenceIndex(nextIndex)

				// If completed the sequence
				if (nextIndex === sequenceCode.length) {
					showToast(
						'You have unlocked the secret mode! Keep exploring and stay curious!',
					)

					// Reset sequence index
					setSequenceIndex(0)
					unlockEasterEggs() // Enable other easter eggs on the page.
					onClose()
				}
			} else if (
				e.key !== 'Tab' &&
				e.key !== 'Escape' &&
				e.key !== 'Shift'
			) {
				// Wrong key, reset sequence (ignoring tab, escape and shift keys)
				setSequenceIndex(0)
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [onClose, sequenceIndex, unlockEasterEggs, showToast])

	return (
		<AnimatePresence>
			<motion.div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="dialog-title"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="bg-background/40 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
				<div className="bg-background max-w-md border border-dashed border-yellow-300/30 shadow-lg md:p-6">
					<h3
						id="dialog-title"
						className="mb-2.5 text-center text-xl font-semibold text-yellow-500/80">
						You curious little hacker, you!
					</h3>

					<p className="mb-6 text-center text-sm text-neutral-300">
						I wonder what will happen if you complete the
						sequence...
					</p>

					<div className="mb-4 flex flex-wrap justify-center gap-2">
						{['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'].map(
							(key, i) => (
								<div
									key={i}
									className={`flex size-12 items-center justify-center border-2 ${
										i < sequenceIndex
											? 'border-emerald-600 bg-emerald-900/20 text-emerald-600'
											: 'border-border bg-secondary text-muted border-dashed'
									}`}>
									<span className="text-lg font-bold">
										{key}
									</span>
								</div>
							),
						)}
					</div>

					<div className="mt-14 flex justify-between text-xs">
						<span className="text-neutral-400">
							{sequenceIndex} / 10 keys pressed
						</span>
						<button
							ref={cancelButtonRef}
							onClick={onClose}
							className="text-neutral-500 hover:text-neutral-300">
							Esc to Close
						</button>
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	)
}
