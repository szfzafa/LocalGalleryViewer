;~ Example 5 Automating chrome
;~ This example shows how to use UI Automation with chrome (later an example will come to put stuff in the html page)
;~ 1. Have chrome started with "--force-renderer-accessibility"
;~ 2. Check with chrome://accessibility in the adress bar if accessibility is on/off, turn it on
;~ a. or close all browsers and change in script the run command to the right path of the chrome.exe
;~
;~ Apparently google changed some stuff in chrome version 29 and seems not allways to return classname properly so sometimes
;~ harder to get the right element

#include <EditConstants.au3>
#include <GUIConstantsEx.au3>
#include <WindowsConstants.au3>
#include <constants.au3>
#include <WinAPI.au3>
#include <debug.au3>
#include <MsgBoxConstants.au3>

#include "UIAWrappers.au3"

GetMyDirs()

Func GetMyDirs()
	Global $srcdir=""
	Global $destdir=""
	While(not FileExists($srcdir))
		$srcdir = InputBox("image/video source folder", "Enter the absolute path", "", " M")
		If($srcdir=="" And @error <> 0) Then
			Exit
		EndIf
		If StringRight($srcdir,1)<>"\" Then
				$srcdir = $srcdir & "\"

		EndIf
		If (not FileExists($srcdir) Or not StringInStr(FileGetAttrib($srcdir),"D")) Then
			MsgBox(0,"invalid path:" & $srcdir, "invalid path:" & $srcdir, 2)
		Else
			ExitLoop
		EndIf
	WEnd

	While(not FileExists($destdir))
		$destdir = InputBox("image/video destination folder", "Enter the absolute path", $srcdir, " M")
		If($destdir=="" And @error <> 0) Then
			Exit
		EndIf
		If StringRight($destdir,1)<>"\" Then
				$destdir = $destdir & "\"
		EndIf
		If (not FileExists($destdir) Or not StringInStr(FileGetAttrib($destdir),"D")) Then
			MsgBox(0,"invalid path:" & $destdir, "invalid path:" & $destdir, 2)
		Else
			ExitLoop
		EndIf
	WEnd

	;consolewrite($srcdir & @CRLF & $destdir)
EndFunc   ;==>Example

#AutoIt3Wrapper_UseX64=Y  ;Should be used for stuff like tagpoint having right struct etc. when running on a 64 bits os
$strChromeExeFolder= @UserProfileDir & "\AppData\Local\Google\Chrome\Application\"
$strChromeStartup="--force-renderer-accessibility"
$strChromeExe=$strChromeExeFolder & "chrome.exe "

if not FileExists($strChromeExe) Then
	$strChromeExeFolder = "C:\Program Files (x86)\Google\Chrome\Application\"
	$strChromeExe=$strChromeExeFolder & "chrome.exe "
EndIf
;~ Start chrome
if fileexists($strChromeExe) Then
    if not processexists("chrome.exe") Then
        run($strChromeExe & $strChromeStartup,"", @SW_MAXIMIZE )
        ProcessWait("chrome.exe")
        ;~ Just to give some time to start
        sleep(10000)
    endif
Else
    ;consolewrite("No clue where to find chrome on your system, please start manually:" & @CRLF )
    ;consolewrite($strChromeExe & $strChromeStartup & @CRLF)
EndIf

	_UIA_setVar("Global.Debug", False)
	_UIA_setVar("Global.Debug.File", False)
	_UIA_setVar("Global.Highlight", False)
Local $aArray
While(True)
	$oChrome=_UIA_getObjectByFindAll($UIA_oDesktop,"class:=Chrome_WidgetWin_1", $treescope_children)
	if isobj($oChrome) Then
		While(True)
			$oUIElementAlert=_UIA_getObjectByFindAll($oChrome, "Name:=LocalGalleryViewerExtension;LegacyIAccessibleRole:=18", $treescope_subtree)
			if isobj($oUIElementAlert) Then
		;~ 		javascript:alert("LocalGalleryViewerExtension_cmd?test")
				$oUIElement=_UIA_getObjectByFindAll($oUIElementAlert, "Name:=LocalGalleryViewerExtension_cmd;ControlType:=" & $UIA_TextControlTypeId, $treescope_subtree)
				if isobj($oUIElement) Then
					$oChrome.setfocus()
					$myCmd = _UIA_getPropertyValue($oUIElement,$UIA_NamePropertyId)
					Send("{ESC}")
;~ 					$myCmd = StringTrimLeft($myCmd, StringLen( "LocalGalleryViewerExtension_cmd?") )
					$aArray = StringSplit($myCmd, "?")
					if $aArray[0] = 3 Then
						$aArray[2] = $srcdir & $aArray[2]
						$aArray[3] = $destdir & $aArray[3]
;~  						MsgBox(0,$aArray[0],@ComSpec & " /c mkdir '" & $aArray[3] & "'" & @CRLF & @ComSpec & " /c copy '" & $aArray[2] & "' '" & $aArray[3] & "'")
						Run(@ComSpec & ' /c mkdir "' & $aArray[3] & '"', "", @SW_HIDE)
						Run(@ComSpec & ' /c move "' & $aArray[2] & '" "' & $aArray[3] & '"', "", @SW_HIDE)
						Sleep(1000)
					EndIf
	;~ 				MsgBox(1,$myCmd, $myCmd,1)
		;~ 			;consolewrite($myCmd& @CRLF)
				Else
					;consolewrite("找不到命令" & @MSEC & @CRLF)
				EndIf
			Else
				;consolewrite("找不到alert窗口" &@MSEC & @CRLF)
				Sleep(500)
;~ 				ExitLoop
			EndIf
		WEnd
	Else
		;consolewrite("找不到Chrome" &@MSEC & @CRLF)
		ExitLoop
	EndIf

;~ 	Sleep(50)
WEnd

exit

