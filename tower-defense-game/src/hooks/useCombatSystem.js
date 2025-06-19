import { useRef, useCallback } from 'react';

/**
 * Custom hook for managing combat mechanics
 * Handles attack timing, damage calculation, and combat interactions
 */
export const useCombatSystem = () => {
  const lastAttackTime = useRef(0);
  const lastHealTime = useRef(0);

  const canAttack = useCallback((attackSpeed) => {
    const currentTime = Date.now();
    return currentTime - lastAttackTime.current >= attackSpeed;
  }, []);

  const performAttack = useCallback((attackSpeed) => {
    if (canAttack(attackSpeed)) {
      lastAttackTime.current = Date.now();
      return true;
    }
    return false;
  }, [canAttack]);

  const canHeal = useCallback(() => {
    const currentTime = Date.now();
    return currentTime - lastHealTime.current >= 1000; // Heal every second
  }, []);

  const performHeal = useCallback(() => {
    if (canHeal()) {
      lastHealTime.current = Date.now();
      return true;
    }
    return false;
  }, [canHeal]);

  const calculateDamage = useCallback((baseDamage, defense = 0) => {
    return Math.max(1, baseDamage - defense);
  }, []);

  const resetCombatTimers = useCallback(() => {
    lastAttackTime.current = 0;
    lastHealTime.current = 0;
  }, []);

  return {
    performAttack,
    performHeal,
    calculateDamage,
    resetCombatTimers
  };
};