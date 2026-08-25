/**
 * The damped scroll progress every scene object reads. A module singleton rather than context
 * because it is written once per frame by the Stage and read in useFrame by everything else:
 * routing it through React would re-render the tree 60 times a second.
 */
export const sequence = {
  p: 0,
  /**
   * The envelope's "carrier" transform: its idle drift and pointer tilt, with the fall tumble
   * excluded. The ticket copies this while it is still inside, so the two move as one rigid object
   * and the ticket cannot sweep through the glass panels. Once it clears the mouth it takes over
   * its own tilt.
   */
  envelope: { x: 0, y: 0, z: 0, tiltX: 0, tiltY: 0 },
};

export function useSequence() {
  return sequence;
}
