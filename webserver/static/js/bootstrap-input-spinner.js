/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/bootstrap-input-spinner
 * License: MIT, see file 'LICENSE'
 */

;(function ($) {
    "use strict"

    var triggerKeyPressed = false
    var originalVal = $.fn.val
    $.fn.val = function (value) {
        if (arguments.length >= 1) {
            if (this[0] && this[0]["bootstrap-input-spinner"] && this[0].setValue) {
                var element = this[0]
                setTimeout(function () {
                    element.setValue(value)
                })
            }
        }
        return originalVal.apply(this, arguments)
    }

    $.fn.inputSpinner = function (methodOrProps) {

        if (methodOrProps === "destroy") {
            this.each(function () {
                this.destroyInputSpinner()
            })
            return this
        }

        var props = {
            decrementButton: "<strong>&minus;</strong>", // button text
            incrementButton: "<strong>&plus;</strong>", // ..
            groupClass: "", // css class of the resulting input-group
            buttonsClass: "btn-outline-secondary",
            buttonsWidth: "2.5rem",
            textAlign: "center", // alignment of the entered number
            autoDelay: 500, // ms threshold before auto value change
            autoInterval: 50, // speed of auto value change
            buttonsOnly: false, // set this `true` to disable the possibility to enter or paste the number via keyboard
            locale: navigator.language, // the locale, per default detected automatically from the browser
            template: // the template of the input
                '<div class="input-group ${groupClass}">' +
                '<div class="input-group-prepend"><button style="min-width: ${buttonsWidth}" class="btn btn-decrement ${buttonsClass} btn-minus" type="button">${decrementButton}</button></div>' +
                '<input type="text" inputmode="decimal" style="text-align: ${textAlign}" class="form-control form-control-text-input"/>' +
                '<div class="input-group-append"><button style="min-width: ${buttonsWidth}" class="btn btn-increment ${buttonsClass} btn-plus" type="button">${incrementButton}</button></div>' +
                '</div>'
        }
        for (var option in methodOrProps) {
            // noinspection JSUnfilteredForInLoop
            props[option] = methodOrProps[option]
        }

        var html = props.template
            .replace(/\${groupClass}/g, props.groupClass)
            .replace(/\${buttonsWidth}/g, props.buttonsWidth)
            .replace(/\${buttonsClass}/g, props.buttonsClass)
            .replace(/\${decrementButton}/g, props.decrementButton)
            .replace(/\${incrementButton}/g, props.incrementButton)
            .replace(/\${textAlign}/g, props.textAlign)

        var locale = props.locale || "en-US"

        this.each(function () {

            var $original = $(this)
            $original[0]["bootstrap-input-spinner"] = true
            $original.hide()

            var autoDelayHandler = null
            var autoIntervalHandler = null

            var $inputGroup = $(html)
            var $buttonDecrement = $inputGroup.find(".btn-decrement")
            var $buttonIncrement = $inputGroup.find(".btn-increment")
            var $input = $inputGroup.find("input")

            // var base = null // base value for step calculations
            var min = null
            var max = null
            var step = null
            var decimals = null
            var digitGrouping = null
            var numberFormat = null

            updateAttributes()

            var value = parseFloat($original[0].value)
            var boostStepsCount = 0

            var prefix = $original.attr("data-prefix") || ""
            var suffix = $original.attr("data-suffix") || ""

            if (prefix) {
                var prefixElement = $('<span class="input-group-text">' + prefix + '</span>')
                $inputGroup.find(".input-group-prepend").append(prefixElement)
            }
            if (suffix) {
                var suffixElement = $('<span class="input-group-text">' + suffix + '</span>')
                $inputGroup.find(".input-group-append").prepend(suffixElement)
            }

            $original[0].setValue = function (newValue) {
                setValue(newValue)
            }
            $original[0].destroyInputSpinner = function () {
                destroy()
            }

            var observer = new MutationObserver(function () {
                updateAttributes()
                setValue(value, true)
            })
            observer.observe($original[0], {attributes: true})

            $original.after($inputGroup)

            setValue(value)

            $input.on("paste input change focusout", function (event) {
                var newValue = $input[0].value
                var focusOut = event.type === "focusout"
                newValue = parseLocaleNumber(newValue)
                setValue(newValue, focusOut)
                dispatchEvent($original, event.type)
            })

            onPointerDown($buttonDecrement[0], function () {
                stepHandling(-step)
            })
            onPointerDown($buttonIncrement[0], function () {
                stepHandling(step)
            })
            onPointerUp(document.body, function () {
                resetTimer()
            })

            function setValue(newValue, updateInput) {
                if (updateInput === undefined) {
                    updateInput = true
                }
                if (isNaN(newValue) || newValue === "") {
                    $original[0].value = ""
                    if (updateInput) {
                        $input[0].value = ""
                    }
                    value = NaN
                } else {
                    newValue = parseFloat(newValue)
                    newValue = Math.min(Math.max(newValue, min), max)
                    newValue = Math.round(newValue * Math.pow(10, decimals)) / Math.pow(10, decimals)
                    $original[0].value = newValue
                    if (updateInput) {
                        $input[0].value = numberFormat.format(newValue)
                    }
                    value = newValue
                }
            }

            function destroy() {
                $original.prop("required", $input.prop("required"))
                observer.disconnect()
                resetTimer()
                $input.off("paste input change focusout")
                $inputGroup.remove()
                $original.show()
            }

            function dispatchEvent($element, type) {
                if (type) {
                    setTimeout(function () {
                        var event
                        if (typeof (Event) === 'function') {
                            event = new Event(type, {bubbles: true})
                        } else { // IE
                            event = document.createEvent('Event')
                            event.initEvent(type, true, true)
                        }
                        $element[0].dispatchEvent(event)
                    })
                }
            }

            function stepHandling(step) {
                calcStep(step)
                resetTimer()
                autoDelayHandler = setTimeout(function () {
                    autoIntervalHandler = setInterval(function () {
                        calcStep(step)
                    }, props.autoInterval)
                }, props.autoDelay)
            }


            function calcStep(step) {
                if (isNaN(value)) {
                    value = 0
                }
                setValue(Math.round(value / step) * step + step)
                dispatchEvent($original, "input")
                dispatchEvent($original, "change")
            }

            function resetTimer() {
                clearTimeout(autoDelayHandler)
                clearTimeout(autoIntervalHandler)
            }

            function updateAttributes() {
                // copy properties from original to the new input
                if ($original.prop("required")) {
                    $input.prop("required", $original.prop("required"))
                    $original.removeAttr('required')
                }
                $input.prop("placeholder", $original.prop("placeholder"))
                $input.attr("inputmode", $original.attr("inputmode") || "decimal")
                var disabled = $original.prop("disabled")
                var readonly = $original.prop("readonly")
                $input.prop("disabled", disabled)
                $input.prop("readonly", readonly || props.buttonsOnly)
                $buttonIncrement.prop("disabled", disabled || readonly)
                $buttonDecrement.prop("disabled", disabled || readonly)
                if (disabled || readonly) {
                    resetTimer()
                }
                var originalClass = $original.prop("class")
                var groupClass = ""
                // sizing
                if (/form-control-sm/g.test(originalClass)) {
                    groupClass = "input-group-sm"
                } else if (/form-control-lg/g.test(originalClass)) {
                    groupClass = "input-group-lg"
                }
                var inputClass = originalClass.replace(/form-control(-(sm|lg))?/g, "")
                $inputGroup.prop("class", "input-group " + groupClass + " " + props.groupClass)
                $input.prop("class", "form-control " + inputClass)

                // update the main attributes
                min = isNaN($original.prop("min")) || $original.prop("min") === "" ? -Infinity : parseFloat($original.prop("min"))
                max = isNaN($original.prop("max")) || $original.prop("max") === "" ? Infinity : parseFloat($original.prop("max"))
                step = parseFloat($original.prop("step")) || 1
                var newDecimals = parseInt($original.attr("data-decimals")) || 0
                var newDigitGrouping = !($original.attr("data-digit-grouping") === "false")
                if (decimals !== newDecimals || digitGrouping !== newDigitGrouping) {
                    decimals = newDecimals
                    digitGrouping = newDigitGrouping
                    numberFormat = new Intl.NumberFormat(locale, {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals,
                        useGrouping: digitGrouping
                    })
                }
                if ($original.attr("hidden")) {
                    $inputGroup.attr("hidden", $original.attr("hidden"))
                } else {
                    $inputGroup.removeAttr("hidden")
                }
            }

            function parseLocaleNumber(stringNumber) {
                var numberFormat = new Intl.NumberFormat(locale)
                var thousandSeparator = numberFormat.format(11111).replace(/1/g, '') || '.'
                var decimalSeparator = numberFormat.format(1.1).replace(/1/g, '')
                return parseFloat(stringNumber
                    .replace(new RegExp(' ', 'g'), '')
                    .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
                    .replace(new RegExp('\\' + decimalSeparator), '.')
                )
            }
        })

        return this
    }

    function onPointerUp(element, callback) {
        element.addEventListener("mouseup", function (e) {
            callback(e)
        })
        element.addEventListener("touchend", function (e) {
            callback(e)
        })
        element.addEventListener("keyup", function (e) {
            if ((e.keyCode === 32 || e.keyCode === 13)) {
                triggerKeyPressed = false
                callback(e)
            }
        })
    }

    function onPointerDown(element, callback) {
        element.addEventListener("mousedown", function (e) {
            e.preventDefault()
            callback(e)
        })
        element.addEventListener("touchstart", function (e) {
            if (e.cancelable) {
                e.preventDefault()
            }
            callback(e)
        })
        element.addEventListener("keydown", function (e) {
            if ((e.keyCode === 32 || e.keyCode === 13) && !triggerKeyPressed) {
                triggerKeyPressed = true
                callback(e)
            }
        })
    }

}(jQuery))
