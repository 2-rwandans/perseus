import {
    KeypadContext,
    StatefulKeypadContextProvider,
} from "@khanacademy/keypad-context";
import {MobileKeypad} from "@khanacademy/math-input";
import {
    Renderer,
    usePerseusI18n,
    type APIOptions,
    type DeviceType,
} from "@khanacademy/perseus";
import {View} from "@khanacademy/wonder-blocks-core";
import {spacing} from "@khanacademy/wonder-blocks-tokens";
import {StyleSheet} from "aphrodite";
import * as React from "react";

import {lintGutterWidth} from "./styles/constants";

import type {PerseusRenderer} from "@khanacademy/perseus-core";
import type {LinterContextProps} from "@khanacademy/perseus-linter";

/**
 * The `ContentPreview` component provides a simple preview system for Perseus
 * Content. Due to how Persus styles are built, the preview styling matches the
 * current device based on the viewport width (using `@media` queries for
 * `min-width` and `max-width`).
 *
 * The preview will render the mobile variant (styling and layout) when the
 * `previewDevice` is phone or tablet. Note that the styling cannot be matched
 * 100% due to the above `@media` query limitation.
 */
function ContentPreview({
    question,
    apiOptions,
    seamless,
    linterContext,
    legacyPerseusLint,
    previewDevice,
}: {
    question?: PerseusRenderer;
    apiOptions?: APIOptions;
    seamless?: boolean;
    linterContext?: LinterContextProps;
    legacyPerseusLint?: ReadonlyArray<string>;
    previewDevice: DeviceType;
}) {
    const i18n = usePerseusI18n();
    const isMobile = previewDevice !== "desktop";

    const className = isMobile ? "perseus-mobile" : "";

    return (
        <View
            className={`framework-perseus ${className}`}
            style={[styles.container, !seamless ? styles.gutter : undefined]}
        >
            <StatefulKeypadContextProvider>
                <KeypadContext.Consumer>
                    {({setKeypadActive, keypadElement, setKeypadElement}) => (
                        <>
                            <Renderer
                                strings={i18n.strings}
                                apiOptions={{...apiOptions, isMobile}}
                                keypadElement={keypadElement}
                                linterContext={linterContext}
                                legacyPerseusLint={legacyPerseusLint}
                                {...question}
                            />

                            <MobileKeypad
                                onAnalyticsEvent={() => Promise.resolve()}
                                onDismiss={() => setKeypadActive(false)}
                                onElementMounted={setKeypadElement}
                            />
                        </>
                    )}
                </KeypadContext.Consumer>
            </StatefulKeypadContextProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.xxxSmall_4,
        containerType: "inline-size",
        containerName: "perseus-root",
    },
    gutter: {marginRight: lintGutterWidth},
});

export default ContentPreview;
