/**
 * Parser utility for extracting clinical metrics from TXT assessment files
 * Ported from legacy SCALENEO implementation
 */

/**
 * Extracts clinical metrics from a text file content using regex patterns
 *
 * Supported metrics:
 * - SBT: STarT Back Tool score (0-9)
 * - CSI: Central Sensitization Inventory (0-100)
 * - ODI: Oswestry Disability Index (0-100)
 * - PCS: Pain Catastrophizing Scale (0-52)
 * - HADS: Hospital Anxiety and Depression Scale (A: 0-21, D: 0-21)
 * - FABQ: Fear-Avoidance Beliefs Questionnaire (Work: 0-100, Activity: 0-100)
 * - NRS: Numeric Rating Scale for pain (at rest, during activity, maximum)
 * - WAI: Working Alliance Inventory (0-100)
 *
 * @param content - Raw text content from the assessment file
 * @returns Object containing extracted metric values with metric keys
 */
export const extractMetricsFromTxt = (content: string): Record<string, number> => {
    const metrics: Record<string, number> = {};

    /**
     * Pattern definitions for each metric
     * Each pattern uses case-insensitive matching and looks for:
     * - Metric name
     * - Valid range in parentheses
     * - Score value after colon, equals, or whitespace
     */
    const patterns: Record<string, RegExp> = {
        sbt: /SBT\s*\(.*0-9\)\s*[:=\s]+(\d+)/iu,
        csi: /CSI Score.*0-100\)\s*[:=\s]+(\d+)/iu,
        odi: /ODI Score.*0-100\)\s*[:=\s]+(\d+)/iu,
        pcs: /PCS Score.*0-52\)\s*[:=\s]+(\d+)/iu,
        hadsAnxiete: /HADS Score Anxiété.*0-21\)\s*[:=\s]+(\d+)/iu,
        hadsDepression: /HADS Score Dépression.*0-21\)\s*[:=\s]+(\d+)/iu,
        fabqTravail: /FABQ Score Travail.*0-100\)\s*[:=\s]+(\d+)/iu,
        fabqActivite: /FABQ Score Activité.*0-100\)\s*[:=\s]+(\d+)/iu,
        nrsRepos: /NRS Douleur au Repos\s*[:=\s]+(\d+)/iu,
        nrsActivite: /NRS Douleur[^R]*l'Activité\s*[:=\s]+(\d+)/iu,
        nrsMax: /NRS Douleur Maximum\s*[:=\s]+(\d+)/iu,
        wai: /WAI Score.*0-100\)\s*[:=\s]+(\d+\.?\d*)/iu,
    };

    for (const [key, pattern] of Object.entries(patterns)) {
        const match = content.match(pattern);
        if (match?.[1]) metrics[key] = parseFloat(match[1]);
    }

    return metrics;
};
