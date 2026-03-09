export class StringUtils {
    static sanitizeIdentifier(
        value: string,
        search: string = ":",
        replacement: string = "_"
    ): string {
        if (!value) {
            return ""
        }
        return value?.split(search).join(replacement)
    }
}