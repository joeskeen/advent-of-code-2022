function SolveN {
    param(
        [string[]]$Lines,
        [int]$N
    )

    $line1 = $Lines[0]
    # also works (.NET way)
    # $input = $Lines[0].ToCharArray()

    for($i = $N; $i -lt $line1.Length; $i++) {
        $substr = $line1.Substring($i - $N, $N).ToCharArray()

        $duplicate = $null
        for($j = 0; $j -lt $substr.Length; $j++) {
            $char = $substr[$j] 
            $firstIndex = $substr.IndexOf($char)

            if ($firstIndex -ne $j) {
                $duplicate = $char
            }
        }
        if ($null -eq $duplicate) {
            Write-Output $i
            return
        }
    }
}

function Solve1($lines) {
    SolveN $lines 4
}

function Solve2 {
    SolveN $lines 14
}

Get-ChildItem $PSScriptRoot `
    | Group-Object { ($_.Name -split '(?!\.\d+)\.')[0] } `
    | Where-Object { $_.Name -ne 'solve' } `
    | ForEach-Object {
        $segments = $_.Name -split '\.'
        $inputFile = $_.Group | Where-Object { $_ -like '*input.*' }
        $outputFile = $_.Group | Where-Object { $_ -like '*.output.*' }
        
        Write-Output ([PSCustomObject]@{
            Name = $segments[0]
            Part = $segments[1]
            Input = (Get-Content $inputFile)
            Output = $outputFile ? (Get-Content $outputFile) : $null
        })
    } `
    | ForEach-Object {
        $n = [PSCustomObject]@{
            1 = 4
            2 = 14
        }
        if ($_.Output) {
            $result = SolveN -Lines $_.Input -N $n.($_.Part)
            if ($result -eq $_.Output) {
                Write-Host "Output for $($_.Name)-$($_.Part) is correct ($result)"
            } else {
                Write-Error "Output for $($_.Name)-$($_.Part) is incorrect (expected $($_.Output) but got $result)"
            }
        } else {
            $result1 = SolveN -Lines $_.Input -N $n.1
            Write-Host "Output for $($_.Name)-1 is $result1"
            $result2 = SolveN -Lines $_.Input -N $n.2
            Write-Host "Output for $($_.Name)-2 is $result2"
        }
    }

# SolveN -Lines @("mjqjpqmgbljsphdztnvjfqwrcgsmlb") -N 4
